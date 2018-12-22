import './styles.scss';
import App from './App';

import { Engine } from "babylonjs";


const canvas = document.getElementById('app');
const engine = new Engine(canvas, true);

const app = new App(canvas, engine);



engine.runRenderLoop(() => {
    app.render();
});