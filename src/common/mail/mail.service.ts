import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemail from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemail.Transporter;
  private readonly logger: Logger = new Logger(MailService.name);
  constructor(private config: ConfigService) {
    if (config.get('NODEMAILER_EMAIL') === '@gmail') {
      this.transporter = nodemail.createTransport({
        service: 'gmail',
        auth: {
          user: config.get('GMAIL_EMAIL_USER'),
          pass: config.get('GOOGLE_APP_PASSWORD'),
        },
      });
    }

    if (config.get('NODEMAILER_EMAIL') === '@163') {
      this.transporter = nodemail.createTransport({
        host: config.get<string>('EMAIL_HOST'),
        port: config.get<number>('EMAIL_PORT'),
        secure: config.get<boolean>('EMAIL_SECURE'),
        auth: {
          user: config.get<string>('EMAIL_USER'),
          pass: config.get<string>('EMAIL_PASS'),
        },
      });
    }
    // console.log(this.transporter, config.get('GOOGLE_APP_PASSWORD'));
  }

  sendMail(email: string, subject: string): Promise<Record<string, string>> {
    const code = Math.random().toString().slice(-6);
    const mailOptions = {
      from: `Wanwan <${this.config.get<string>('EMAIL_USER')}>`,
      to: email,
      // text: `Here is your verification code: ${code}, valid for 5 minutes`,
      subject,
      html: `<p>Here is your verification code: <b style="font-size: 30px;">${code}</b>, valid for 5 minutes</p>`,
    };
    this.logger.log(`用户验证码为：${code}, 有效期为5分钟, 请及时使用!`);
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        mailOptions,
        (error: Error, info: { envelope: Record<string, string[]> }) => {
          if (error) {
            reject(
              new HttpException(
                `发送邮件失败: ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          } else {
            resolve({ code, ...info.envelope });
          }
        },
      );
    });
  }
}
