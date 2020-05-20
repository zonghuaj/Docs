import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {_HttpClient} from "@delon/theme";
import {get, post, put, deleteMethod} from 'admin-ui-angular-common';

@Injectable()
export class AdminUiAngularQualityGateService {

  constructor(private http: _HttpClient) {
  }

  getQualityGatePorjectList(pageNumber = 1, pageSize = 100,
                            projectName = ''): Observable<any> {
    const params = {pageSize, pageNumber, projectName};
    return get(this.http, sonsurl('quality/projects'), params);
  }

  addQualityGateProject(qp: any): Observable<any> {
    return post(this.http, sonsurl('quality/projects'), qp);
  }

  editQualityGateProject(qp: any): Observable<any> {
    return put(this.http, sonsurl('quality/projects'), qp);
  }

  deleteQualityGateProject(pkey: string): Observable<any> {
    return deleteMethod(this.http, sonsurl(`quality/projects/${pkey}`));
  }

  getQualityGateProjectDetail(pkey: string) {
    return get(this.http, sonsurl(`quality/projects/${pkey}`));
  }

  getQualityGateProjectDetailMetric(pkey: string) {
    return get(this.http, sonsurl(`quality/projects/${pkey}/page`));
  }

  getAllQualityGates(): Observable<any> {
    return get(this.http, sonsurl('quality/gates'));
  }

  getQualityGateMetrics(): Observable<any> {
    return of(MOCK_RULES);
  }

  getGualityGateDetail(id: string) {
    return get(this.http, sonsurl(`quality/gates/${id}`));
  }

  createGualityGateRule(qualityGateName: string) {
    return post(this.http, sonsurl('quality/gates'), {qualityGateName});
  }

  deleteGualityGateRule(id: string) {
    return deleteMethod(this.http, sonsurl(`quality/gates/${id}`));
  }

  createGualityGateCondition(condition: {
    gateId: string;
    metric: string;
    op: 'GT' | 'LT' | string;
    error: string;
  }) {
    return post(this.http, sonsurl(`quality/gates/condition`), condition);
  }

  delQualityGateCondition(id) {
    return deleteMethod(this.http, sonsurl(`quality/gates/condition/${id}`));
  }

  qgRuleBindProject(id, projs) {
    return post(this.http, sonsurl(`quality/gates/${id}/associate`), projs);
  }

  qgRuleUnbindProject(id, projs) {
    return post(this.http, sonsurl(`quality/gates/${id}/disassociate`), projs);
  }
}

function sonsurl(targetPath) {
  return `pipeline/$TENANT_ID/project/$PROJECT_CODE/${targetPath}`;
}

// tslint:disable
const MOCK_RULES = {
  "metrics": [{
    "id": "119",
    "key": "new_technical_debt",
    "type": "WORK_DUR",
    "name": "Added Technical Debt",
    "description": "Added technical debt",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "96",
    "key": "blocker_violations",
    "type": "INT",
    "name": "Blocker Issues",
    "description": "Blocker issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "63",
    "key": "new_it_conditions_to_cover",
    "type": "INT",
    "name": "Branches to Cover by IT on New Code",
    "description": "Branches to cover by Integration Tests on New Code",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "114",
    "key": "bugs",
    "type": "INT",
    "name": "Bugs",
    "description": "Bugs",
    "domain": "Reliability",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "142",
    "key": "burned_budget",
    "type": "FLOAT",
    "name": "Burned budget",
    "domain": "Management",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": true,
    "decimalScale": 1
  }, {
    "id": "143",
    "key": "business_value",
    "type": "FLOAT",
    "name": "Business value",
    "domain": "Management",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": true,
    "decimalScale": 1
  }, {
    "id": "25",
    "key": "class_complexity_distribution",
    "type": "DISTRIB",
    "name": "Class Distribution / Complexity",
    "description": "Classes distribution /complexity",
    "domain": "Complexity",
    "direction": 0,
    "qualitative": true,
    "hidden": true,
    "custom": false
  }, {
    "id": "7",
    "key": "classes",
    "type": "INT",
    "name": "Classes",
    "description": "Classes",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "112",
    "key": "code_smells",
    "type": "INT",
    "name": "Code Smells",
    "description": "Code Smells",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "28",
    "key": "cognitive_complexity",
    "type": "INT",
    "name": "Cognitive Complexity",
    "description": "Cognitive complexity",
    "domain": "Complexity",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "18",
    "key": "commented_out_code_lines",
    "type": "INT",
    "name": "Commented-Out LOC",
    "description": "Commented lines of code",
    "domain": "Documentation",
    "direction": -1,
    "qualitative": true,
    "hidden": true,
    "custom": false
  }, {
    "id": "14",
    "key": "comment_lines",
    "type": "INT",
    "name": "Comment Lines",
    "description": "Number of comment lines",
    "domain": "Size",
    "direction": 1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "136",
    "key": "comment_lines_data",
    "type": "DATA",
    "name": "comment_lines_data",
    "domain": "Size",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "15",
    "key": "comment_lines_density",
    "type": "PERCENT",
    "name": "Comments (%)",
    "description": "Comments balanced by ncloc + comment lines",
    "domain": "Size",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "22",
    "key": "class_complexity",
    "type": "FLOAT",
    "name": "Complexity / Class",
    "description": "Complexity average by class",
    "domain": "Complexity",
    "direction": -1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "20",
    "key": "file_complexity",
    "type": "FLOAT",
    "name": "Complexity / File",
    "description": "Complexity average by file",
    "domain": "Complexity",
    "direction": -1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "24",
    "key": "function_complexity",
    "type": "FLOAT",
    "name": "Complexity / Function",
    "description": "Complexity average by function",
    "domain": "Complexity",
    "direction": -1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "21",
    "key": "complexity_in_classes",
    "type": "INT",
    "name": "Complexity in Classes",
    "description": "Cyclomatic complexity in classes",
    "domain": "Complexity",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "23",
    "key": "complexity_in_functions",
    "type": "INT",
    "name": "Complexity in Functions",
    "description": "Cyclomatic complexity in functions",
    "domain": "Complexity",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "49",
    "key": "branch_coverage",
    "type": "PERCENT",
    "name": "Condition Coverage",
    "description": "Condition coverage",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "67",
    "key": "new_it_branch_coverage",
    "type": "PERCENT",
    "name": "Condition Coverage by IT on New Code",
    "description": "Integration tests condition coverage of new/changed code",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "50",
    "key": "new_branch_coverage",
    "type": "PERCENT",
    "name": "Condition Coverage on New Code",
    "description": "Condition coverage of new/changed code",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "51",
    "key": "conditions_by_line",
    "type": "DATA",
    "name": "Conditions by Line",
    "description": "Conditions by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "45",
    "key": "conditions_to_cover",
    "type": "INT",
    "name": "Conditions to Cover",
    "description": "Conditions to cover",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "46",
    "key": "new_conditions_to_cover",
    "type": "INT",
    "name": "Conditions to Cover on New Code",
    "description": "Conditions to cover on new code",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "111",
    "key": "confirmed_issues",
    "type": "INT",
    "name": "Confirmed Issues",
    "description": "Confirmed issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "36",
    "key": "coverage",
    "type": "PERCENT",
    "name": "Coverage",
    "description": "Coverage by tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "54",
    "key": "new_it_coverage",
    "type": "PERCENT",
    "name": "Coverage by IT on New Code",
    "description": "Integration tests coverage of new/changed code",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "44",
    "key": "coverage_line_hits_data",
    "type": "DATA",
    "name": "Coverage Hits by Line",
    "description": "Coverage hits by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "37",
    "key": "new_coverage",
    "type": "PERCENT",
    "name": "Coverage on New Code",
    "description": "Coverage of new/changed code",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "52",
    "key": "covered_conditions_by_line",
    "type": "DATA",
    "name": "Covered Conditions by Line",
    "description": "Covered conditions by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "97",
    "key": "critical_violations",
    "type": "INT",
    "name": "Critical Issues",
    "description": "Critical issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "19",
    "key": "complexity",
    "type": "INT",
    "name": "Cyclomatic Complexity",
    "description": "Cyclomatic complexity",
    "domain": "Complexity",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "141",
    "key": "last_commit_date",
    "type": "MILLISEC",
    "name": "Date of Last Commit",
    "domain": "SCM",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "122",
    "key": "development_cost",
    "type": "STRING",
    "name": "Development Cost",
    "description": "Development cost",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": true,
    "custom": false
  }, {
    "id": "123",
    "key": "new_development_cost",
    "type": "STRING",
    "name": "Development Cost on New Code",
    "description": "Development cost on new code",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": true,
    "custom": false
  }, {
    "id": "9",
    "key": "directories",
    "type": "INT",
    "name": "Directories",
    "description": "Directories",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "89",
    "key": "duplicated_blocks",
    "type": "INT",
    "name": "Duplicated Blocks",
    "description": "Duplicated blocks",
    "domain": "Duplications",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "90",
    "key": "new_duplicated_blocks",
    "type": "INT",
    "name": "Duplicated Blocks on New Code",
    "description": "Duplicated blocks on new code",
    "domain": "Duplications",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "91",
    "key": "duplicated_files",
    "type": "INT",
    "name": "Duplicated Files",
    "description": "Duplicated files",
    "domain": "Duplications",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "87",
    "key": "duplicated_lines",
    "type": "INT",
    "name": "Duplicated Lines",
    "description": "Duplicated lines",
    "domain": "Duplications",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "92",
    "key": "duplicated_lines_density",
    "type": "PERCENT",
    "name": "Duplicated Lines (%)",
    "description": "Duplicated lines balanced by statements",
    "domain": "Duplications",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "88",
    "key": "new_duplicated_lines",
    "type": "INT",
    "name": "Duplicated Lines on New Code",
    "description": "Duplicated Lines on New Code",
    "domain": "Duplications",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "93",
    "key": "new_duplicated_lines_density",
    "type": "PERCENT",
    "name": "Duplicated Lines on New Code (%)",
    "description": "Duplicated lines on new code balanced by statements",
    "domain": "Duplications",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "94",
    "key": "duplications_data",
    "type": "DATA",
    "name": "Duplication Details",
    "description": "Duplications details",
    "domain": "Duplications",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "126",
    "key": "effort_to_reach_maintainability_rating_a",
    "type": "WORK_DUR",
    "name": "Effort to Reach Maintainability Rating A",
    "description": "Effort to reach maintainability rating A",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "137",
    "key": "executable_lines_data",
    "type": "DATA",
    "name": "executable_lines_data",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "107",
    "key": "false_positive_issues",
    "type": "INT",
    "name": "False Positive Issues",
    "description": "False positive issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "27",
    "key": "file_complexity_distribution",
    "type": "DISTRIB",
    "name": "File Distribution / Complexity",
    "description": "Files distribution /complexity",
    "domain": "Complexity",
    "direction": 0,
    "qualitative": true,
    "hidden": true,
    "custom": false
  }, {
    "id": "8",
    "key": "files",
    "type": "INT",
    "name": "Files",
    "description": "Number of files",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "26",
    "key": "function_complexity_distribution",
    "type": "DISTRIB",
    "name": "Function Distribution / Complexity",
    "description": "Functions distribution /complexity",
    "domain": "Complexity",
    "direction": 0,
    "qualitative": true,
    "hidden": true,
    "custom": false
  }, {
    "id": "10",
    "key": "functions",
    "type": "INT",
    "name": "Functions",
    "description": "Functions",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "2",
    "key": "generated_lines",
    "type": "INT",
    "name": "Generated Lines",
    "description": "Number of generated lines",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "6",
    "key": "generated_ncloc",
    "type": "INT",
    "name": "Generated Lines of Code",
    "description": "Generated non Commenting Lines of Code",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "100",
    "key": "info_violations",
    "type": "INT",
    "name": "Info Issues",
    "description": "Info issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "95",
    "key": "violations",
    "type": "INT",
    "name": "Issues",
    "description": "Issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "62",
    "key": "it_conditions_to_cover",
    "type": "INT",
    "name": "IT Branches to Cover",
    "description": "Integration Tests conditions to cover",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "66",
    "key": "it_branch_coverage",
    "type": "PERCENT",
    "name": "IT Condition Coverage",
    "description": "Condition coverage by integration tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "68",
    "key": "it_conditions_by_line",
    "type": "DATA",
    "name": "IT Conditions by Line",
    "description": "IT conditions by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "53",
    "key": "it_coverage",
    "type": "PERCENT",
    "name": "IT Coverage",
    "description": "Integration tests coverage",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "61",
    "key": "it_coverage_line_hits_data",
    "type": "DATA",
    "name": "IT Coverage Hits by Line",
    "description": "Coverage hits by line by integration tests",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "69",
    "key": "it_covered_conditions_by_line",
    "type": "DATA",
    "name": "IT Covered Conditions by Line",
    "description": "IT covered conditions by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "59",
    "key": "it_line_coverage",
    "type": "PERCENT",
    "name": "IT Line Coverage",
    "description": "Line coverage by integration tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "55",
    "key": "it_lines_to_cover",
    "type": "INT",
    "name": "IT Lines to Cover",
    "description": "Lines to cover by Integration Tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "64",
    "key": "it_uncovered_conditions",
    "type": "INT",
    "name": "IT Uncovered Conditions",
    "description": "Uncovered conditions by integration tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "57",
    "key": "it_uncovered_lines",
    "type": "INT",
    "name": "IT Uncovered Lines",
    "description": "Uncovered lines by integration tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "42",
    "key": "line_coverage",
    "type": "PERCENT",
    "name": "Line Coverage",
    "description": "Line coverage",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "60",
    "key": "new_it_line_coverage",
    "type": "PERCENT",
    "name": "Line Coverage by IT on New Code",
    "description": "Integration tests line coverage of added/changed code",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "43",
    "key": "new_line_coverage",
    "type": "PERCENT",
    "name": "Line Coverage on New Code",
    "description": "Line coverage of added/changed code",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "1",
    "key": "lines",
    "type": "INT",
    "name": "Lines",
    "description": "Lines",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "3",
    "key": "ncloc",
    "type": "INT",
    "name": "Lines of Code",
    "description": "Non commenting lines of code",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "5",
    "key": "ncloc_language_distribution",
    "type": "DATA",
    "name": "Lines of Code Per Language",
    "description": "Non Commenting Lines of Code Distributed By Language",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "38",
    "key": "lines_to_cover",
    "type": "INT",
    "name": "Lines to Cover",
    "description": "Lines to cover",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "56",
    "key": "new_it_lines_to_cover",
    "type": "INT",
    "name": "Lines to Cover by IT on New Code",
    "description": "Lines to cover on new code by integration tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "39",
    "key": "new_lines_to_cover",
    "type": "INT",
    "name": "Lines to Cover on New Code",
    "description": "Lines to cover on new code",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "120",
    "key": "sqale_rating",
    "type": "RATING",
    "name": "Maintainability Rating",
    "description": "A-to-E rating based on the technical debt ratio",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "121",
    "key": "new_maintainability_rating",
    "type": "RATING",
    "name": "Maintainability Rating on New Code",
    "description": "Maintainability rating on new code",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "98",
    "key": "major_violations",
    "type": "INT",
    "name": "Major Issues",
    "description": "Major issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "99",
    "key": "minor_violations",
    "type": "INT",
    "name": "Minor Issues",
    "description": "Minor issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "135",
    "key": "ncloc_data",
    "type": "DATA",
    "name": "ncloc_data",
    "domain": "Size",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "102",
    "key": "new_blocker_violations",
    "type": "INT",
    "name": "New Blocker Issues",
    "description": "New Blocker issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "115",
    "key": "new_bugs",
    "type": "INT",
    "name": "New Bugs",
    "description": "New Bugs",
    "domain": "Reliability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "113",
    "key": "new_code_smells",
    "type": "INT",
    "name": "New Code Smells",
    "description": "New Code Smells",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "103",
    "key": "new_critical_violations",
    "type": "INT",
    "name": "New Critical Issues",
    "description": "New Critical issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "106",
    "key": "new_info_violations",
    "type": "INT",
    "name": "New Info Issues",
    "description": "New Info issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "101",
    "key": "new_violations",
    "type": "INT",
    "name": "New Issues",
    "description": "New issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "4",
    "key": "new_lines",
    "type": "INT",
    "name": "New Lines",
    "description": "New lines",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "104",
    "key": "new_major_violations",
    "type": "INT",
    "name": "New Major Issues",
    "description": "New Major issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "105",
    "key": "new_minor_violations",
    "type": "INT",
    "name": "New Minor Issues",
    "description": "New Minor issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "117",
    "key": "new_vulnerabilities",
    "type": "INT",
    "name": "New Vulnerabilities",
    "description": "New Vulnerabilities",
    "domain": "Security",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "109",
    "key": "open_issues",
    "type": "INT",
    "name": "Open Issues",
    "description": "Open issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "79",
    "key": "overall_conditions_to_cover",
    "type": "INT",
    "name": "Overall Branches to Cover",
    "description": "Branches to cover by all tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "80",
    "key": "new_overall_conditions_to_cover",
    "type": "INT",
    "name": "Overall Branches to Cover on New Code",
    "description": "New branches to cover by all tests",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "83",
    "key": "overall_branch_coverage",
    "type": "PERCENT",
    "name": "Overall Condition Coverage",
    "description": "Condition coverage by all tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "84",
    "key": "new_overall_branch_coverage",
    "type": "PERCENT",
    "name": "Overall Condition Coverage on New Code",
    "description": "Condition coverage of new/changed code by all tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "85",
    "key": "overall_conditions_by_line",
    "type": "DATA",
    "name": "Overall Conditions by Line",
    "description": "Overall conditions by all tests and by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "70",
    "key": "overall_coverage",
    "type": "PERCENT",
    "name": "Overall Coverage",
    "description": "Overall test coverage",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "78",
    "key": "overall_coverage_line_hits_data",
    "type": "DATA",
    "name": "Overall Coverage Hits by Line",
    "description": "Coverage hits by all tests and by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "71",
    "key": "new_overall_coverage",
    "type": "PERCENT",
    "name": "Overall Coverage on New Code",
    "description": "Overall coverage of new/changed code",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "86",
    "key": "overall_covered_conditions_by_line",
    "type": "DATA",
    "name": "Overall Covered Conditions by Line",
    "description": "Overall covered conditions by all tests and by line",
    "domain": "Coverage",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "76",
    "key": "overall_line_coverage",
    "type": "PERCENT",
    "name": "Overall Line Coverage",
    "description": "Line coverage by all tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "77",
    "key": "new_overall_line_coverage",
    "type": "PERCENT",
    "name": "Overall Line Coverage on New Code",
    "description": "Line coverage of added/changed code by all tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "72",
    "key": "overall_lines_to_cover",
    "type": "INT",
    "name": "Overall Lines to Cover",
    "description": "Overall lines to cover by all tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "73",
    "key": "new_overall_lines_to_cover",
    "type": "INT",
    "name": "Overall Lines to Cover on New Code",
    "description": "New lines to cover by all tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "81",
    "key": "overall_uncovered_conditions",
    "type": "INT",
    "name": "Overall Uncovered Conditions",
    "description": "Uncovered conditions by all tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "82",
    "key": "new_overall_uncovered_conditions",
    "type": "INT",
    "name": "Overall Uncovered Conditions on New Code",
    "description": "New conditions that are not covered by any test",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "74",
    "key": "overall_uncovered_lines",
    "type": "INT",
    "name": "Overall Uncovered Lines",
    "description": "Uncovered lines by all tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "75",
    "key": "new_overall_uncovered_lines",
    "type": "INT",
    "name": "Overall Uncovered Lines on New Code",
    "description": "New lines that are not covered by any tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "140",
    "key": "quality_profiles",
    "type": "DATA",
    "name": "Profiles",
    "description": "Details of quality profiles used during analysis",
    "domain": "General",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "13",
    "key": "projects",
    "type": "INT",
    "name": "Projects",
    "description": "Number of projects",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "12",
    "key": "public_api",
    "type": "INT",
    "name": "Public API",
    "description": "Public API",
    "domain": "Documentation",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "16",
    "key": "public_documented_api_density",
    "type": "PERCENT",
    "name": "Public Documented API (%)",
    "description": "Public documented classes and functions balanced by ncloc",
    "domain": "Documentation",
    "direction": 1,
    "qualitative": true,
    "hidden": true,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "17",
    "key": "public_undocumented_api",
    "type": "INT",
    "name": "Public Undocumented API",
    "description": "Public undocumented classes, functions and variables",
    "domain": "Documentation",
    "direction": -1,
    "qualitative": true,
    "hidden": true,
    "custom": false
  }, {
    "id": "139",
    "key": "quality_gate_details",
    "type": "DATA",
    "name": "Quality Gate Details",
    "description": "The project detailed status with regard to its quality gate",
    "domain": "General",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "138",
    "key": "alert_status",
    "type": "LEVEL",
    "name": "Quality Gate Status",
    "description": "The project status with regard to its quality gate.",
    "domain": "Releasability",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "129",
    "key": "reliability_rating",
    "type": "RATING",
    "name": "Reliability Rating",
    "description": "Reliability rating",
    "domain": "Reliability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "130",
    "key": "new_reliability_rating",
    "type": "RATING",
    "name": "Reliability Rating on New Code",
    "description": "Reliability rating on new code",
    "domain": "Reliability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "127",
    "key": "reliability_remediation_effort",
    "type": "WORK_DUR",
    "name": "Reliability Remediation Effort",
    "description": "Reliability Remediation Effort",
    "domain": "Reliability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "128",
    "key": "new_reliability_remediation_effort",
    "type": "WORK_DUR",
    "name": "Reliability Remediation Effort on New Code",
    "description": "Reliability remediation effort on new code",
    "domain": "Reliability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "110",
    "key": "reopened_issues",
    "type": "INT",
    "name": "Reopened Issues",
    "description": "Reopened issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "133",
    "key": "security_rating",
    "type": "RATING",
    "name": "Security Rating",
    "description": "Security rating",
    "domain": "Security",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "134",
    "key": "new_security_rating",
    "type": "RATING",
    "name": "Security Rating on New Code",
    "description": "Security rating on new code",
    "domain": "Security",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "131",
    "key": "security_remediation_effort",
    "type": "WORK_DUR",
    "name": "Security Remediation Effort",
    "description": "Security remediation effort",
    "domain": "Security",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "132",
    "key": "new_security_remediation_effort",
    "type": "WORK_DUR",
    "name": "Security Remediation Effort on New Code",
    "description": "Security remediation effort on new code",
    "domain": "Security",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "32",
    "key": "skipped_tests",
    "type": "INT",
    "name": "Skipped Unit Tests",
    "description": "Number of skipped unit tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "145",
    "key": "sonarjava_feedback",
    "type": "DATA",
    "name": "SonarJava feedback",
    "direction": 0,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "11",
    "key": "statements",
    "type": "INT",
    "name": "Statements",
    "description": "Number of statements",
    "domain": "Size",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "144",
    "key": "team_size",
    "type": "INT",
    "name": "Team size",
    "domain": "Management",
    "direction": 0,
    "qualitative": false,
    "hidden": false,
    "custom": true
  }, {
    "id": "118",
    "key": "sqale_index",
    "type": "WORK_DUR",
    "name": "Technical Debt",
    "description": "Total effort (in days) to fix all the issues on the component and therefore to comply to all the requirements.",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "124",
    "key": "sqale_debt_ratio",
    "type": "PERCENT",
    "name": "Technical Debt Ratio",
    "description": "Ratio of the actual technical debt compared to the estimated cost to develop the whole source code from scratch",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "125",
    "key": "new_sqale_debt_ratio",
    "type": "PERCENT",
    "name": "Technical Debt Ratio on New Code",
    "description": "Technical Debt Ratio of new/changed code.",
    "domain": "Maintainability",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "47",
    "key": "uncovered_conditions",
    "type": "INT",
    "name": "Uncovered Conditions",
    "description": "Uncovered conditions",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "65",
    "key": "new_it_uncovered_conditions",
    "type": "INT",
    "name": "Uncovered Conditions by IT on New Code",
    "description": "New conditions that are not covered by integration tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "48",
    "key": "new_uncovered_conditions",
    "type": "INT",
    "name": "Uncovered Conditions on New Code",
    "description": "Uncovered conditions on new code",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "40",
    "key": "uncovered_lines",
    "type": "INT",
    "name": "Uncovered Lines",
    "description": "Uncovered lines",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "58",
    "key": "new_it_uncovered_lines",
    "type": "INT",
    "name": "Uncovered Lines by IT on New Code",
    "description": "New lines that are not covered by integration tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": true,
    "custom": false
  }, {
    "id": "41",
    "key": "new_uncovered_lines",
    "type": "INT",
    "name": "Uncovered Lines on New Code",
    "description": "Uncovered lines on new code",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "35",
    "key": "test_data",
    "type": "DATA",
    "name": "Unit Test Details",
    "description": "Unit tests details",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "30",
    "key": "test_execution_time",
    "type": "MILLISEC",
    "name": "Unit Test Duration",
    "description": "Execution duration of unit tests",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "31",
    "key": "test_errors",
    "type": "INT",
    "name": "Unit Test Errors",
    "description": "Number of unit test errors",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "33",
    "key": "test_failures",
    "type": "INT",
    "name": "Unit Test Failures",
    "description": "Number of unit test failures",
    "domain": "Coverage",
    "direction": -1,
    "qualitative": true,
    "hidden": false,
    "custom": false
  }, {
    "id": "29",
    "key": "tests",
    "type": "INT",
    "name": "Unit Tests",
    "description": "Number of unit tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "34",
    "key": "test_success_density",
    "type": "PERCENT",
    "name": "Unit Test Success (%)",
    "description": "Density of successful unit tests",
    "domain": "Coverage",
    "direction": 1,
    "qualitative": true,
    "hidden": false,
    "custom": false,
    "decimalScale": 1
  }, {
    "id": "116",
    "key": "vulnerabilities",
    "type": "INT",
    "name": "Vulnerabilities",
    "description": "Vulnerabilities",
    "domain": "Security",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }, {
    "id": "108",
    "key": "wont_fix_issues",
    "type": "INT",
    "name": "Won't Fix Issues",
    "description": "Won't fix issues",
    "domain": "Issues",
    "direction": -1,
    "qualitative": false,
    "hidden": false,
    "custom": false
  }], "total": 145, "p": 1, "ps": 500
};
