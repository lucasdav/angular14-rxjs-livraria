import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item, Livro } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnDestroy {

  listaLivros: Livro[];
  campoBusca = '';
  subscription: Subscription;
  livro: Livro;

  constructor(private service: LivroService) { }

  buscarLivros() {
    //Através da subscription, que representa a execução de um Observable, é possível conectar observer e observable.
    //O Observer é uma coleção de callbacks que sabe escutar os valores entregues pelo Observable.
    //para executar o observable é preciso chamar o subscribe
    this.subscription = this.service.buscar(this.campoBusca).subscribe({
      next: (items) => {
        this.listaLivros = this.livrosResultadoParaLivros(items);
      },
      error: erro => console.error(erro),
      complete: () => console.log('Observable completado')
    })
  }

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}



