import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('ListaLivrosComponent: fluxo inicial da busca')),
    // abaixo uso do distinctUntilChanged compara o valor atual com o valor imediatamente anterior 
    // e não com valores passados já informados. forem iguais, nada acontece. Se forem diferentes, 
    // é feita uma nova requisição e o valor muda.
    distinctUntilChanged(),
    // uso do switchMap para performance de busca, ele espera formar a palavra para buscar
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livrosResultado = resultado),
    catchError(erro => {
      console.log(erro)
      // abaixo a função dele será emitir um valor e, logo em seguida, completar o Observable
      return of()
    })
  )

  // Abaixo o $ no final da variavel indica que é um observable, por convensão de nomenclatura.
  //Através da subscription, que representa a execução de um Observable, é possível conectar observer
  // e observable.
  //O Observer é uma coleção de callbacks que sabe escutar os valores entregues pelo Observable.
  //Para executar o observable é preciso chamar o subscribe
  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('ListaLivrosComponent: fluxo inicial da busca')),
      // abaixo uso do distinctUntilChanged compara o valor atual com o valor imediatamente anterior 
      // e não com valores passados já informados. forem iguais, nada acontece. Se forem diferentes, 
      // é feita uma nova requisição e o valor muda.
      distinctUntilChanged(),
      // uso do switchMap para performance de busca, ele espera formar a palavra para buscar
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap(() => console.log('ListaLivrosComponent: fluxo da requisicao ao servidor para a busca')),
      map(resultado => resultado.items ?? []),
      map(items => this.livrosResultadoParaLivros(items)),
      // o operador catchError abaixo captura um erro, se houver
      catchError((erro) => {
        this.mensagemErro = 'Ops ocorreu um erro. Recarregue a aplicação';
        //abaixo EMPTY usado quando não é preciso tratar o erro, ele
        // encerra o ciclo de vida do observable, por isso é necessario recarregar
        //return EMPTY;
        //console.log(erro)
        // abaixo pode ser usado quando precisa tratar erro
        return throwError(() => new Error(this.mensagemErro = 'Ops ocorreu um erro. Recarregue a aplicação'))
      })
    )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}



