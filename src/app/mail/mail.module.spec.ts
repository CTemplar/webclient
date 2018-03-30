import { MailModule } from './mail.module';

describe('MailModule', () => {
  let mailModule: MailModule;

  beforeEach(() => {
    mailModule = new MailModule();
  });

  it('should create an instance', () => {
    expect(mailModule).toBeTruthy();
  });
});
