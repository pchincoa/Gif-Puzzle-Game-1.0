// Confetti Objekt

class Confetti {

   constructor() {

      //Stellung und Farben

      this.x = random(0, width);
      this.y = random(0, -height);
      this.r = random(255);
      this.g = random(10, 200);
      this.b = random(20, 255);

      // die gezeichnete Form zeigen

      this.show = function () {
         noStroke();
         fill(this.r, this.g, this.b);
         rect(this.x, this.y, random(7, 10), random(3, 10));

      };

      // die Konfettischleife aktualisieren

      this.update = function () {
         this.speed = random(0.5, 1.5);
         this.y = this.y + this.speed;
         this.x = this.x + random(-1,1);

         // Kontrollstruktur der Update-Funktion
         if (this.y > height) {
            this.y = random(0, -height);
         }
      };

   }

}