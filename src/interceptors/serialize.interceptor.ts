import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// import { UserDto } from 'src/users/dtos/user.dto';

// type any den kurtulamk ıcın yaptık
// type olarak class belırtmesı gerektıgını soyledık
interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
// aşağıda bulunan butun bır kodu custom Decarator haline getiridk
// Daha sonrasında controller a gidip @UseInterceptopos()bla bla yapmak yerıne
// @Serialize(DtoAdı) yapmamız yeterlı oluyor

// IMPORTANT LESSON  => implements extends ile aynı değildir!
// Extends => whenever we are subclassing an existing class
// Implements =>anytime that we want to create a new class that satisfies all the requirements of either an abstract class or interface

// IMPORTANT LESSON
// Serialaztation => bir veri yapısını veya nesne durumunu, daha sonra depolanabilecek veya iletilebilecek ve yeniden oluşturulabilecek bir biçime çevirme işlemidir.

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // run something before req handler
    // console.log('Im runnıng before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          // burada data yı instance of userDto yapıyoruz
          // burda belırttıgımız ılk degerın hardocded olmaması lazım yanı sureklı degısebılır bır Dto yapısında olması lazım bunun ıcın bır consturctor tasarladık
          // daha sonrasında nerede kullanmak ıstıyorsak onun controllerında @UseInterceptor() decaratorune sahıp başlıgı buup ıcerısıne(new SerializeClass adı(kullanacagımız dto))
          excludeExtraneousValues: true, // bu kod cok onemlı her seyın beklenıldıgı gıbı calısmasını saglıyor daha dogrusu emın oluyor
        });

        // run something before the response is sent
        // console.log('Im running before response is sent out ', data);
      }),
    );
  }
}
