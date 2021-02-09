import { ErrorHandler, Inject,Injector,Injectable} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(@Inject(Injector) private injector: Injector) {
    //   super(true);
   }
   private get toastrService(): ToastrService {
    return this.injector.get(ToastrService);
  }
  handleError(error) {
      console.log(error , "Actual error")
   
    // if(error.error.status_code == 400){
    //     if('name' in error.error){
    //         this.toastrService.error('Error', 'Name cannot be empty')

    //     }
    //     else{
    //         console.log(error.error.detail , "ERROR DETAIL")
    //         this.toastrService.error('Error', error.error.detail)

    //     }
       
    // }
     throw error;
  }
  
}