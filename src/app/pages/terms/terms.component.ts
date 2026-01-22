import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api-service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {

  termsContent: string = '';

  constructor(private router: Router,private apiService:ApiService) {
  }

  ngOnInit() {
    const currentUrl = this.router.url;
    const key = currentUrl.split("/")[1];
    this.loadTerms(key)
  }

  loadTerms(key:string){
    if(key){
      this.apiService.getPage(key).subscribe({
        next:(res:any)=>{
          this.termsContent = res?.record?.content;
        },
        error:(error:any)=>{
          console.log(error);
        }
      })
    }
  }

}
