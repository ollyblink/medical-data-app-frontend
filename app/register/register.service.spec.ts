import {RegisterService} from "./register.service";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Response, HttpModule, XHRBackend, ResponseOptions, Http} from "@angular/http";
import {TestBed, async, inject} from "@angular/core/testing";
import {User} from "../models/user";
describe('RegisterService', ()=> {

  let service: RegisterService;
  let backend: MockBackend;
  let response: Response;

  beforeEach(async(()=> {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [RegisterService, {provide: XHRBackend, useClass: MockBackend}]
    }).compileComponents();
  }));

  beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend)=> {
    backend = be;
    service = new RegisterService(http);
    let options = new ResponseOptions({status: 200, body: {message: 'Successfully created user with username o100'}});
    response = new Response(options);
  }));

  it('#register should register and return a successful register message', async(()=> {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

    service.register(new User('u100', 'u100'))
      .then(message=> expect(message).toEqual('Successfully created user with username o100'));
  }));
});
