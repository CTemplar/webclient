import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordRegex } from '../../../../../shared/config';

export const PasswordValidation = {
  MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('confirmPwd').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('confirmPwd').setErrors({ MatchPassword: true });
    }
  },
};

@Component({
  selector: 'app-password-section',
  templateUrl: './password-section.component.html',
  styleUrls: ['./password-section.component.scss'],
})
export class PasswordSectionComponent implements OnInit {
  @Output() next = new EventEmitter();

  passwordForm: FormGroup;

  submitted = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group(
      {
        password: [
          '',
          [Validators.required, Validators.minLength(8), Validators.maxLength(128), Validators.pattern(passwordRegex)],
        ],
        confirmPwd: ['', [Validators.required, Validators.maxLength(128)]],
      },
      {
        validator: PasswordValidation.MatchPassword,
      },
    );
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}
