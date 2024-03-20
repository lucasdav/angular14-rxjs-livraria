import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
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

  constructor(private service: LivroService) { }

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
      // uso do switchMap para performance de busca, ele espera formar a palavra para buscar
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap(() => console.log('ListaLivrosComponent: fluxo da requisicao ao servidor para a busca')),
      map(items => this.livrosResultadoParaLivros(items))
    )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}



