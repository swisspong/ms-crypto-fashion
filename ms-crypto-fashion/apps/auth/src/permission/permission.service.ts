import { PermissionFormat } from '@app/common/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService {


  async findAll() {
    try {
      var resultArray = Object.keys(PermissionFormat).map((permissionIndex) => {
        let permission = PermissionFormat[permissionIndex];
        // ทำบางอย่างกับ permission
        return permission !== PermissionFormat.SYSTEM_OWNER ? permission : undefined;
      }).filter(permission => permission !== undefined);
      return resultArray
    } catch (error) {
      throw error
    }
  }

}
