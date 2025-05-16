import './style.css'
    import { createApp } from 'vue'

    const app = createApp({
      data() {
        return {
          motorcycles: [
            { id: 1, name: 'Honda CBR600RR', price: 75 },
            { id: 2, name: 'Yamaha R6', price: 80 },
            { id: 3, name: 'Kawasaki Ninja ZX-6R', price: 85 }
          ],
          booking: {
            motorcycleId: null,
            startDate: '',
            endDate: '',
            name: '',
            email: '',
            phone: ''
          },
          confirmation: null,
          error: null
        }
      },
      methods: {
        async submitBooking() {
          this.error = null;
          try {
            const response = await fetch('/api/book.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(this.booking)
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Booking failed');
            }

            this.confirmation = await response.json();
            this.booking = {
              motorcycleId: null,
              startDate: '',
              endDate: '',
              name: '',
              email: '',
              phone: ''
            };
          } catch (err) {
            this.error = err.message || 'An unexpected error occurred.';
          }
        }
      },
      computed: {
        totalPrice() {
          if (!this.booking.motorcycleId || !this.booking.startDate || !this.booking.endDate) {
            return 0;
          }

          const motorcycle = this.motorcycles.find(m => m.id === parseInt(this.booking.motorcycleId));
          if (!motorcycle) return 0;

          const startDate = new Date(this.booking.startDate);
          const endDate = new Date(this.booking.endDate);
          const diffInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

          if (diffInDays <= 0 || isNaN(diffInDays)) {
            return 0;
          }

          return motorcycle.price * diffInDays;
        }
      },
      template: `
        <div class="container">
          <h1>Motorcycle Booking</h1>

          <div v-if="error" class="error">
            {{ error }}
          </div>

          <div v-if="confirmation" class="confirmation">
            <h2>Booking Confirmation</h2>
            <p>Thank you, {{ confirmation.name }}!</p>
            <p>You have booked a {{ motorcycles.find(m => m.id === parseInt(confirmation.motorcycleId)).name }} from {{ confirmation.startDate }} to {{ confirmation.endDate }}.</p>
            <p>Total Price: ${{ confirmation.totalPrice }}</p>
          </div>

          <form @submit.prevent="submitBooking" v-else>
            <div class="form-group">
              <label for="motorcycle">Motorcycle:</label>
              <select id="motorcycle" v-model="booking.motorcycleId" required>
                <option value="" disabled>Select a motorcycle</option>
                <option v-for="motorcycle in motorcycles" :key="motorcycle.id" :value="motorcycle.id">
                  {{ motorcycle.name }} - ${{ motorcycle.price }} / day
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="startDate">Start Date:</label>
              <input type="date" id="startDate" v-model="booking.startDate" required>
            </div>

            <div class="form-group">
              <label for="endDate">End Date:</label>
              <input type="date" id="endDate" v-model="booking.endDate" required>
            </div>

            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" v-model="booking.name" required>
            </div>

            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" v-model="booking.email" required>
            </div>

            <div class="form-group">
              <label for="phone">Phone:</label>
              <input type="tel" id="phone" v-model="booking.phone" required>
            </div>

            <div class="form-group">
              <strong>Total Price: ${{ totalPrice }}</strong>
            </div>

            <button type="submit">Book Now</button>
          </form>
        </div>
      `
    })

    app.mount('#app')
