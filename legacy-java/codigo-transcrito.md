# Código original (2023): transcripción de las capturas

Lo único que se conserva del código original son seis capturas de pantalla, reunidas en la lámina "Behinds" del Figma de Valeria. Están en `captura-codigo-2023.png`.

Esta es la transcripción de lo que se lee en ellas. Son **fragmentos**: faltan las clases (`Enemigo`, `Trampa`, `Comodin`, `BalaJug`, `Jugador`, `Boss`), el final de `juego()` y todo lo que maneja el cronómetro, el cambio de nivel y el jefe. Lo que no aparece aquí no se conoce.

La captura es de baja resolución y la fuente del editor usa ceros con raya. Los números se leyeron ampliando la imagen; coinciden con los del diseño en Figma (por ejemplo, los 50 puntos).

## Qué se aprende del código

| Dato | Valor | Dónde se ve |
|---|---|---|
| Entorno | Processing (Java): `setup()`, `draw()`, `PImage`, `millis()` | todo el archivo |
| Librerías | `tramontana.library`, `websockets`, `processing.sound` | líneas `import` |
| Control | El celular se conectaba por red (`new Tramontana(this,"192.168.0.16")`) y enviaba toque (`subscribeTouch`) y orientación (`subscribeAttitude(5)`). Variables `xGiro`, `yGiro`. | `setup()` |
| Dónde corría | En la computadora, en una ventana de **1280 × 720**. El celular era el control. | `size(1280, 720)` |
| Pantallas | 5 escenarios: 1 Portada, 2 Instrucciones, 3 Fondo (juego), 4 Game Over, 5 Win | `draw()` |
| Aparición de enemigos | cada **5000 ms** | `intervaloEnemigo = 5000` |
| Aparición de trampas | cada **10000 ms** | `intervaloTrampas = 10000` |
| Aparición de comodines (estrella) | cada **12000 ms** | `intervaloComodin = 12000` |
| Cronómetro | **60000 ms** (60 s) | `interCronometro = 60000` |
| Nivel inicial | 1 | `nivel = 1` |
| Niveles normales | 1 a 3. Después viene otra rama (el jefe). | `if (nivel <= 3)` |
| Movimiento | Enemigos, trampas y comodines se mueven (`mover()`) y comparten una velocidad, `velEne`, que es variable. | bucles de `juego()` |
| Disparo | El héroe genera "balas" (`BalaJug`). Hay impacto cuando una bala queda a **menos de 40 px** del objeto. | "validaciones" |
| Acertar a un enemigo | `puntaje += 50`, y se eliminan el enemigo y la bala | "validaciones" |
| Acertar a una trampa | `puntaje -= 50`, y se elimina la trampa | "validaciones" |
| Sonido | Había música de introducción prevista, pero las líneas están comentadas | fin de `setup()` |

Nombres de las imágenes que cargaba: `Portada.png`, `Instrucciones.png`, `Fondo.png`, `Game Over.png`, `Win.png`, `Arma burbuja.png`, `Más tiempo.png` (comodín), `Medusa enemigo.png` (enemigo), `Menos tiempo.png` (trampa), `Enemigo final boss.png`.

## Qué sigue sin saberse

- El valor de `velEne` y si cambia con el nivel.
- Hacia dónde se mueven los objetos y cuándo dejan de estar "vivos".
- El puntaje necesario para pasar de nivel.
- Qué pasa cuando el cronómetro llega a cero.
- Cuánto tiempo suma el comodín.
- Si el puntaje puede bajar de cero. En el fragmento visible no hay ningún límite después de `puntaje -= 50`, pero la captura se corta ahí.
- Si la bala viaja desde el héroe o aparece donde está la mira.
- Todo lo del jefe.
- Si los intervalos de aparición cambian con el nivel (solo se ven los valores iniciales).

## Transcripción

### Captura 1: variables

```java
import tramontana.library.*;
import websockets.*;
import processing.sound.*;

Tramontana t;

ArrayList<Enemigo> enemigos;
ArrayList<BalaJug> balasHeroe;
ArrayList<Trampa> trampas;
ArrayList<Comodin> comodines;
Jugador heroe;
Boss jefe;

int escenario;

//--------------- intervalo de los enemigos
long instanteEnemigo;
int intervaloEnemigo;

long instanteTrampas;
int intervaloTrampas;

long instanteComodin;
int intervaloComodin;

long instCronometro;
int interCronometro;

float xGiro, yGiro;

int puntaje;
int nivel;
float velEne;   // línea medio tapada por la barra del editor; el nombre se confirma más abajo
```

### Captura 2: imágenes y `setup()`

```java
PImage img1;
PImage img2;
PImage img3;
PImage img4;
PImage img5;

PImage burbuja;
PImage comodin;
PImage enemigo;
PImage trampa;
PImage boss;

void setup() {
  size(1280, 720);
  img1 = loadImage("Portada.png");
  img2 = loadImage("Instrucciones.png");
  img3 = loadImage("Fondo.png");
  img4 = loadImage("Game Over.png");
  img5 = loadImage("Win.png");

  burbuja = loadImage("Arma burbuja.png");
  comodin = loadImage("Más tiempo.png");
  enemigo = loadImage("Medusa enemigo.png");
  trampa = loadImage("Menos tiempo.png");
  boss = loadImage("Enemigo final boss.png");

  t = new Tramontana(this,"192.168.0.16");
  t.subscribeTouch();
  t.subscribeAttitude(5);
```

### Captura 3: valores iniciales y `draw()`

```java
  enemigos = new ArrayList<Enemigo>();
  trampas = new ArrayList<Trampa>();
  comodines = new ArrayList<Comodin>();
  intervaloEnemigo = 5000;
  intervaloTrampas = 10000;
  intervaloComodin = 12000;
  heroe = new Jugador();
  balasHeroe = new ArrayList<BalaJug>();
  nivel = 1;
  interCronometro = 60000;
  jefe = new Boss();

  //aqui ponen a sonar la musica intro
  //intro.loop();
  //intro.play();
}

void draw() {

  if (escenario == 1) {
    background(img1);
  }
  else if (escenario == 2) {
    background(img2);
  }
  else if (escenario == 3) {
    background(img3);
  }
  else if (escenario == 4) {
    background(img4);
  }
```

### Captura 4: fin de `draw()` e inicio de `juego()`

```java
  else if (escenario == 5) {
    background(img5);
  }
}


void juego() {

  if (nivel <= 3) {

    if (millis() - instanteEnemigo > intervaloEnemigo) {
      instanteEnemigo = millis();
      Enemigo nuevo = new Enemigo();
      enemigos.add(nuevo);
    }

    if (millis() - instanteTrampas > intervaloTrampas) {
      instanteTrampas = millis();
      Trampa nuevo = new Trampa();
      trampas.add(nuevo);
    }

    if (millis() - instanteComodin > intervaloComodin) {
      instanteComodin = millis();
      Comodin nuevo = new Comodin();
      comodines.add(nuevo);
    }

    for (int x=0; x<enemigos.size(); x++) {
```

### Captura 5: mover y dibujar

```java
      Enemigo temp = enemigos.get(x);

      temp.mover();
      temp.dibujar();
      temp.setVelocidad(velEne);

      if (temp.getAlive() == false) {
        enemigos.remove(x);
      }
    }

    for (int x=0; x<trampas.size(); x++) {
      Trampa temp = trampas.get(x);

      temp.mover();
      temp.dibujar();
      temp.setVelocidad(velEne);

      if (temp.getAlive() == false) {
        trampas.remove(x);
      }
    }

    for (int x=0; x<comodines.size(); x++) {
      Comodin temp = comodines.get(x);

      temp.mover();
      temp.dibujar();
      temp.setVelocidad(velEne);

      if (temp.getAlive() == false) {
        // la captura se corta aquí
```

### Captura 6: balas e impactos

```java
    }

    for (int x=0; x<balasHeroe.size(); x++) {
      BalaJug aux = balasHeroe.get(x);

      aux.dibujar();

      if (aux.getIsAlive() == false) {
        balasHeroe.remove(x);
      }
    }

    //-------validaciones
    for (int w=0; w<balasHeroe.size(); w++) {
      BalaJug aux = balasHeroe.get(w);

      for (int x=0; x<enemigos.size(); x++) {
        Enemigo temp = enemigos.get(x);

        if (temp.getPosEnemigo().dist(aux.getPosBalaJug()) < 40) {
          puntaje += 50;
          temp.desvalidar();
          aux.desvalidar();
        }
      }

      for (int z=0; z<trampas.size(); z++) {
        Trampa auxT = trampas.get(z);
        if (auxT.getPosTrampa().dist(aux.getPosBalaJug()) < 40) {
          puntaje -= 50;
          auxT.desvalidar();
          // la captura se corta aquí
```
