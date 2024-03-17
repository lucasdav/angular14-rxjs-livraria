import { Component } from '@angular/core';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  listaLivros: [];
  campoBusca = '';

  constructor(private service: LivroService) { }

  buscarLivros() {
    //Através da subscription, que representa a execução de um Observable, é possível conectar observer e observable.
    //O Observer é uma coleção de callbacks que sabe escutar os valores entregues pelo Observable.
    //para executar o observable é preciso chamar o subscribe
    this.service.buscar(this.campoBusca).subscribe({
      next: retornoAPI => console.log(retornoAPI),
      error: erro => console.error(erro),
      complete: () => console.log('Observable completado')
    })
  }

}



