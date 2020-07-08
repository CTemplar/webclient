import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditcardnumber'
})

export class CreditCardNumberPipe implements PipeTransform {

  transform(plainCreditCard: string): string {
    const defaultCardNumberLength = 16;
    if (plainCreditCard.length < 16) {
      plainCreditCard = plainCreditCard.padStart(defaultCardNumberLength, '0');
    }
    return plainCreditCard.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').replace(/\d{4}(?= \d{4})/g, "xxxx").trim();
  }

}
