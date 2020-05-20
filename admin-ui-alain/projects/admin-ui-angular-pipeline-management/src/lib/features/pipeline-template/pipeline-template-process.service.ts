import {Injectable} from "@angular/core";
import {
  PIPELINE_TEMPLATE_CONSTANTS,
  PipelineStage,
  PipelineTemplateInfo,
  PipelineTemplateParam
} from "./pipeline-template.entities";
import {parseCustomParameters, parseStages} from "admin-ui-angular-common";

@Injectable()
export class PipelineTemplateProcessService {
  currTemplate: PipelineTemplateInfo;

  constructor() {
  }

  reset() {
    this.currTemplate = {} as PipelineTemplateInfo
    // this.currTemplate.script = MOCK_CODE;
  }

  setInfo(info) {
    this.currTemplate = {...this.currTemplate, ...info};
  }

  setCode(tempCodes) {
    this.currTemplate.script = tempCodes;
  }

  setParameters(params) {
    this.currTemplate.params = params;
  }

  getParams(): PipelineTemplateParam[] {
    const constants = PIPELINE_TEMPLATE_CONSTANTS.map(p => p.key);
    return parseCustomParameters(this.currTemplate.script)
      .filter(p => constants.indexOf(p) < 0) // parameter not in constants
      .map(p => ({
        key: p, label: '', defValue: '', promptMessage: ''
      }));
  }

  getStages(): PipelineStage[] {
    return parseStages(this.currTemplate.script).map(s => ({name: s}));
  }
}

const MOCK_CODE = `def label = "slave-\${UUID.randomUUID().toString()}"
def variable = {{ENV_PROCESS}}
podTemplate(label: label, containers: [
    containerTemplate(
        name: 'jnlp',
        image: 'jenkins/jnlp-slave:latest',
        alwaysPullImage: false,
        privileged: true,
        args: '\${computer.jnlpmac} \${computer.name}'),
    containerTemplate(name: 'node', image: 'harbor.atcdevops.accenture.cn/devops/idpbuildtool', command: 'cat', ttyEnabled: true,  privileged: true),
    containerTemplate(name: 'docker', image: 'docker:latest', command: 'cat', ttyEnabled: true,  privileged: true),
    containerTemplate(name: 'node1016', image: 'node:10.16.0', command: 'cat', ttyEnabled: true,  privileged: true),
],
namespace: 'devops', serviceAccount: 'jenkins',
volumes: [
    hostPathVolume(hostPath: {{JENKINS_PATH}}, mountPath: '/home/jenkins'),
    hostPathVolume(hostPath: {{KUBE_PATH}}, mountPath: '/home/jenkins/.kube/config'),
    hostPathVolume(hostPath: {{KUBECTL_PATH}}, mountPath: '/home/jenkins/kubectl'),
    hostPathVolume(hostPath: {{DOCKER_PATH}}, mountPath: '/user/bin/docker'),
    hostPathVolume(hostPath: {{SOCK_PATH}}, mountPath: '/var/run/docker.sock'),
]) {
    node(label) {
        stage('Preparation') {

        }
        stage('Clone Source') {
            try{
                checkout([$class: 'GitSCM', branches: [[name: '*/release']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'SSHGitlabAccess', url: 'git@gitlab.atcdevops.accenture.cn:MicroPaaS/micropaas-admin/admin-ui-alain.git']]])
            }
            catch(err){
                error "\${err}"
            }
        }
        stage('Compile') {
            container("node1016") {
                sh 'npm install'
                sh 'npm run build --prod'
            }
        }
        // stage('Code Analysis') {
        //     container('node')
        //     {
        //         try {
        //             withSonarQubeEnv('Sonarqube') {
        //                 sh 'npm run test-coverage'
        //                 sh 'export NODE_OPTIONS=--max_old_space_size=4096 && sonar-scanner -Dsonar.projectKey=IES_Asset_micropaas_frontend -Dsonar.projectName=IES_Asset_micropaas_frontend -X -Dsonar.sources=src -Dsonar.projectVersion=1.0.\${BUILD_NUMBER} -Dsonar.language=ts -Dsonar.typescript.lcov.reportPaths=coverage/admin-ui-angular/lcov.info -Dsonar.sourceEncoding=UTF-8 -Dsonar.scm.enabled=false'
        //             }
        //         } catch(err) {
        //             error "\${err}"
        //         }
        //     }
        // }
        // stage("SonarQube Quality Gate")
        // {
        //     container('node')
        //     {
        //         sh "cat .scannerwork/report-task.txt"
        //         def props = readProperties  file: '.scannerwork/report-task.txt'
        //         echo "properties=\${props}"
        //         def sonarServerUrl=props['serverUrl']
        //         def ceTaskUrl= props['ceTaskUrl']
        //         def ceTask
        //         timeout(time: 1, unit: 'MINUTES') {
        //             waitUntil {
        //                 def response = httpRequest ceTaskUrl
        //                 ceTask = readJSON text: response.content
        //                 echo ceTask.toString()
        //                 return "SUCCESS".equals(ceTask["task"]["status"])
        //             }
        //         }
        //         def result = httpRequest url : sonarServerUrl + "/api/qualitygates/project_status?analysisId=" + ceTask["task"]["analysisId"], authentication: 'SONAR-SCANNER'
        //         def qualitygate =  readJSON text: result.content
        //         echo "Quality Gate Result: "+qualitygate.toString()
        //         if ("ERROR".equals(qualitygate["projectStatus"]["status"])) {
        //             error  "Quality Gate failure"
        //         }
        //     }
        // }
        stage('Build Image') {
            container('docker') {
                sh 'docker build -t harbor.atcdevops.accenture.cn/micropaas/admin_frontend:1.0-$BUILD_NUMBER .'
                sh 'docker build -t harbor.atcdevops.accenture.cn/micropaas/admin_frontend:latest .'
                withCredentials([usernamePassword(credentialsId: 'harbor', passwordVariable: 'password', usernameVariable: 'username')]) {
                    sh 'docker login harbor.atcdevops.accenture.cn -u $username -p $password'
                }
                sh 'docker push harbor.atcdevops.accenture.cn/micropaas/admin_frontend:1.0-$BUILD_NUMBER'
                sh 'docker push harbor.atcdevops.accenture.cn/micropaas/admin_frontend:latest'
            }
        }

        stage('Deploy') {
            sh '/home/jenkins/kubectl apply -f deployment.yaml'



            sh '/home/jenkins/kubectl -n micropaas set image deploy adminfrontend adminfrontend=harbor.atcdevops.accenture.cn/micropaas/admin_frontend:1.0-$BUILD_NUMBER'
        }
    }
}`;
