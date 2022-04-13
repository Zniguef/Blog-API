import { AuthGuard } from "@nestjs/passport";

export class OptionalAuthGuard extends AuthGuard('jwt') {
  handelRequest(err, user, info, context) {
    return user;
  }
}