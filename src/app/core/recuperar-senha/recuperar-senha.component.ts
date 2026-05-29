import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services.service';


@Component({
  selector: 'app-recuperar-senha',
  imports: [TitleComponent, RouterLink, HttpClientModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
})
export class RecuperarSenhaComponent {
  constructor(private http: HttpClient, private servicesService: ServicesService) {}

  public renderBody(): void {
    const body = document.querySelector('.login-form') as HTMLElement;

    if (body) {
      body.innerHTML = `
       <form>
            <div class="form-group">
                <label for="code">Digite seu código</label>
                <input type="text" #codeInput id="code" name="code" class="form-control"
                placeholder="Digite seu código" required (input)=0>
            </div>

            <div class="form-footer">


               <button type="submit" class="btn btn-primary" [disabled]="!codeInput.validity.valid">
                    <span class="material-symbols-outlined">
                        chevron_forward
                    </span>
                </button>

            </div>

        </form>

      `;
    }
  }

  postEmail(email: string) {
    this.servicesService.requestPasswordReset(email)
  }
}
