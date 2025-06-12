import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-appointment',
  imports: [
    FormsModule
  ],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.scss'
})
export class CreateAppointmentComponent {
  protected category: string = '';

  protected submit() {
    Swal.fire({
      icon: 'info',
      title: 'Please Wait',
      text: 'Creating your appointment schedule...',
      showConfirmButton: false,
    });

    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Appointment schedule created successfully!'
      });
    }, 2500)
  }
}
