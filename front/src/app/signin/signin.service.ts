import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class SigninService
{
  //private authRequestUrl = 'http://localhost:3000/api/authentification/';
  private authRequestUrl = 'https://api.intra.42.fr/oauth/authorize?client_id=d4570548182bf2a5bfc57fa5c36fb0765188aded46627ae57f4859cdb0b05715&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauthentification%2F42%2Fcallback&response_type=code';
  private authRequestOptions = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin':'*' }) };

  constructor(private http: HttpClient) {}

  signinWith42()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get<{}>(this.authRequestUrl + '42/', this.authRequestOptions)
        .toPromise()
        .then(response => { console.log(response);resolve(response); },
              error => { reject(error); });
    });
  }
}
