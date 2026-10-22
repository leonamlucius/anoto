import { Component } from '@angular/core';

import { TitleComponent } from '../../../../shared/components/title/title.component';

@Component({
  selector: 'app-footer',
  imports: [TitleComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  public footerLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/leonamlucius', icon: 'bi bi-linkedin' },
    { name: 'GitHub', url: 'https://github.com/leonamlucius', icon: 'bi bi-github' },
    { name: 'Portfólio', url: 'https://leonamlucius.com/', icon: 'bi bi-globe2' },
  ];


  public openLink(url: string): void {
    window.open(url, '_blank');
  }
}
