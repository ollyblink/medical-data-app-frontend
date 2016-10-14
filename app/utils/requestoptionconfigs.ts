import {RequestOptions, Headers} from '@angular/http';

export var postRequestOptionsWithoutCredentials = new RequestOptions({
  headers: new Headers({
    'Content-Type': 'application/json'
  })
});

export var postRequestOptionsWithCredentials = new RequestOptions({
  headers: new Headers({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
});
