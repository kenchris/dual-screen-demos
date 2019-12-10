export class VirtualKeyboard extends HTMLElement {
  #shadowRoot = null;
  #anim = null;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({mode: 'closed'});
    this.#shadowRoot.innerHTML = `
      <style>
        :host {
          background-color: #373737;
          height: 400px;
          width: calc((100vw - var(--env-fold-width)) / 2);
          position: absolute;
          bottom: 0px;
          --left: 0px;
          --right: calc(50vw + var(--env-fold-width) / 2);
          left: var(--right);
          opacity: 0;
          display: none;
          overflow: hidden;
          }
          img {
          object-fit: contain;
          width: 100%;
          height: 100%;
        }
      </style>
      <img src="vkb.png" id="keyboard"></img>
    `;
  }

  open(options) {
    const side = options.side || "right";

    if (!["left", "right"].includes(side)) {
      return;
    }

    if (this.#anim) {
      this.#anim.cancel();
    }

    const docStyle = document.documentElement.style;
    if (side == "left") {
      docStyle.setProperty('--env-left-side-keyboard-bottom', '400px');
      this.style.left = 'var(--left)';
    } else {
      docStyle.setProperty('--env-right-side-keyboard-bottom', '400px');
      this.style.left = 'var(--right)';
    }

    this.style.opacity = 1;
    this.style.display = "block";
  }

  dismiss() {
    this.#anim = this.animate([ {opacity: 1}, {opacity: 0}], { fill: 'forwards', duration: 500});
    this.#anim.onfinish = () => { this.style.display = 'none' };

    const docStyle = document.documentElement.style;
    docStyle.setProperty('--env-left-side-keyboard-bottom', "0px");
    docStyle.setProperty('--env-right-side-keyboard-bottom', "0px");
  }
}

customElements.define('virtual-keyboard', VirtualKeyboard);