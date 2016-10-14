import {LoginService} from "./login.service";
import {User} from "../models/user";
import {Http, XHRBackend, HttpModule, Response, ResponseOptions} from "@angular/http";
import {inject, TestBed, async} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
describe("LoginService", ()=> {

  let service: LoginService;
  let backend: MockBackend;
  let response: Response;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        LoginService,
        {provide: XHRBackend, useClass: MockBackend}
      ]
    })
      .compileComponents();
  }));
  beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
    backend = be;
    service = new LoginService(http);
    let options = new ResponseOptions({status: 200, body: {message: 'user u1 logged in', user: 'u1'}});
    response = new Response(options);
  }));

  it('#login should log in and return real user and message', async(()=> {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

    service.login(new User('u1', 'u1')).then(json => {
        expect(json.message).toEqual("user u1 logged in");
        expect(json.user).toEqual('u1');
      }
    );

  }));

});
