import {Injectable} from '@angular/core';
import {_HttpClient, SettingsService} from '@delon/theme';
import {EventEntity, EventListEntity} from "./event.entities";
import {zdelete, zget, zput, zget_todo} from "./event.util";
import {BehaviorSubject, interval, Observable, of, Subject, Subscription, zip} from "rxjs";
import {mergeMap, switchMap} from "rxjs/operators";

@Injectable()
export class EventManageService {
  msgRefreshSubscriber$: Subscription;
  readonly AUTO_REFRESH_INTERVAL = 15 * 1000;

  constructor(private http: _HttpClient,
              public settings: SettingsService,) {
  }

  startWatchingMsg(): void {
    this.stopWatchingMsg(); // clear previous first

    // this.msgRefreshSubscriber$ = interval(this.AUTO_REFRESH_INTERVAL).pipe(
    //   mergeMap(() => this.getUnreadMessages()),
    // ).subscribe((unreadMsgs: EventListEntity) => {
    //   this.setUnreadMsgs(unreadMsgs);
    // });

    this.msgRefreshSubscriber$ = interval(this.AUTO_REFRESH_INTERVAL).pipe(
      mergeMap(() => 
        zip(this.getUnreadMessages(),
          this.getToDoMessages())
      ),
    ).subscribe(([eventUnRead,todoUnRead]) => {
      var eventUnReadEntity= eventUnRead as EventListEntity;
      var todoUnReadEntity= todoUnRead as EventListEntity;
      var results = [ ...todoUnReadEntity.rows, ...eventUnReadEntity.rows];
      var lastResults ={
        "count": eventUnReadEntity.count+todoUnReadEntity.count,
        "rows": results
      };
      this.setUnreadMsgs(lastResults as EventListEntity);
    });
  }

  stopWatchingMsg(): void {
    if (this.msgRefreshSubscriber$) {
      this.msgRefreshSubscriber$.unsubscribe();
      this.msgRefreshSubscriber$ = null;
    }
  }

  get username() {
    return this.settings.user.preferred_username;
  }

  getUnreadCount(pageNo: number = 1,
                 pageSize: number = 1) {
    const params = {pageNo, pageSize};
    return zget<EventListEntity>(this.http, `$TENANT_ID/events/alert/${this.username}/unread`, params)
      .pipe(switchMap((res: EventListEntity) => of(res.count)));
  }

  getUnreadMessages(pageNo: number = 1,
                    pageSize: number = 10) {
    const params = {pageNo, pageSize};
    return zget<EventListEntity>(this.http, `$TENANT_ID/events/alert/${this.username}/unread`, params);
  }

  getToDoMessages(pageNo: number = 1,
    pageSize: number = 10) {
    const params = {pageNo, pageSize};
  return zget_todo<EventListEntity>(this.http, `$TENANT_ID/artifactoryVersion/workflow/toDo`, params);
}

  getAll(pageNo: number = 1,
         pageSize: number = 100) {
    const params = {pageNo, pageSize};
    return zget<EventListEntity>(this.http, `$TENANT_ID/events/alert/${this.username}`, params)
  }

  getToDoAll(pageNo: number = 1,
    pageSize: number = 100) {
  const params = {pageNo, pageSize};
  return zget_todo<EventListEntity>(this.http, `$TENANT_ID/artifactoryVersion/workflow/toDo/pageable`, params)
}

  getEventDetail(id: number) {
    return zget<EventEntity>(this.http, `$TENANT_ID/events/alert/${this.username}/` + id);
  }

  setRead(id: any, read: boolean): Observable<any> {
    return zput(this.http, `$TENANT_ID/events/alert/${id}/read`);
  }

  deleteEvent(id: number) {
    return zdelete(this.http, `$TENANT_ID/events/alert/${id}`);
  }

  refreshMsgImmediately() {
    this.getUnreadMessages().subscribe(res => {
      this.setUnreadMsgs(res);
    });
  }

  unreadMsgObsr: Subject<EventListEntity>;

  setUnreadMsgs(msgs: EventListEntity) {
    if (this.unreadMsgObsr) {
      this.unreadMsgObsr.next(msgs);
    }
  }

  _setUnreadMsgObserved(ob: BehaviorSubject<EventListEntity>): void {
    this.unreadMsgObsr = ob;
  }
}
