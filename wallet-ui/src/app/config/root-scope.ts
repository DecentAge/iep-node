import { Observable ,  Observer ,  Subject } from 'rxjs';

export class RootScope {

    public static data: any = {};

    private static subject = new Subject<any>();

    public static onChange = RootScope.subject.asObservable();

    public static set(data: any) {

        RootScope.data = Object.assign(RootScope.data, data);
        RootScope.subject.next(RootScope.data);
    }
}
