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
    //para executar o observable é preciso chamar o subscribe
    this.service.buscar(this.campoBusca).subscribe((retornoApi) => console.log(retornoApi))
  }

}



