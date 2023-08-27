import { PermissionFormat } from '@app/common/enums';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService {


  async findAll() {
    try {
      var resultArray = Object.keys(PermissionFormat).map( (permissionIndex) => {
        let permission = PermissionFormat[permissionIndex];
        // do something with permission
        return permission;
      });
      return resultArray
    } catch (error) {
      throw error
    }
  }

}
