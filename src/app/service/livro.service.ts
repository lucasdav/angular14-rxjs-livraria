import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private readonly API = 'https://www.googleapis.com/books/v1/volumes';
  constructor(private http: HttpClient) { }


  // pipe  servirá para agrupar diversos outros tipos de operadores, então é como a tradução "cano" em que 
  // passará o fluxo de informações para aplicarmos as transformações
  // passaremos o segundo operador chamado tap(), que por sua vez é como se fosse um "espião", 
  // ou seja, é utilizado apenas para debug da aplicação
  buscar(valorDigitado: string): Observable<LivrosResultado> {
    const params = new HttpParams().append('q', valorDigitado);
    return this.http.get<LivrosResultado>(this.API, { params }).pipe(
      tap((retornoAPI) => console.log('LivroService: ',retornoAPI))
    )
  }
}
