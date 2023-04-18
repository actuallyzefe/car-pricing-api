import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// data => Decorator içine pass edilen value
// Context => Incoming Request

// Bu yarattığımız param decoratoru DI içerisine giremez bundan dolayı buna ek oalrak bir de interceptor yapacağız
// Bu ikisi birlikte çalışarak bize currentUser'ı sunacak
export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  },
);
