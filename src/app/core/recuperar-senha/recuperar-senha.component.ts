import { Component } from '@angular/core';
import { TitleComponent } from '../title/title.component';

@Component({
  selector: 'app-recuperar-senha',
  imports: [TitleComponent],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss'],
})
export class RecuperarSenhaComponent {
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
}
