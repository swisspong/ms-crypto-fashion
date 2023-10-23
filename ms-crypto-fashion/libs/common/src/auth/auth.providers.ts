import { APP_GUARD } from "@nestjs/core";
import { DutiesGuard, JwtGuard, PermissionsGuard, RolesGuard } from "../guards";


export const authProviders = [
    {
        provide: APP_GUARD,
        useClass: JwtGuard,
      },
      {
        provide: APP_GUARD,
        useClass: RolesGuard,
      },
      {
        provide: APP_GUARD,
        useClass: PermissionsGuard
      },
      {
        provide: APP_GUARD,
        useClass: DutiesGuard
      },
  ];