import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../Services/api-service';

@Component({
  selector: 'app-how',
  standalone: true,
  imports: [],
  templateUrl: './how.component.html',
  styleUrl: './how.component.scss'
})
export class HowComponent {

  howContent: string = '';

  constructor(private router: Router, private apiServie: ApiService) { }

  ngOnInit() {
    const currentUrl = this.router.url
    const key = currentUrl.split("/")[1];
    this.loadHow(key)
    console.log(this.howContent);
    

  }

  loadHow(key: string) {
    if (key) {
      this.apiServie.getPage(key).subscribe({
        next: (res: any) => {
          this.howContent = res?.record?.content;
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  }


}
