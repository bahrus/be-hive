import { MOSE } from 'mount-observer-script-element/MOSE.js';
import 'mount-observer/handlers/EnhanceMountedElement.js';
export class BeHive extends MOSE(HTMLElement) {
}
customElements.define('be-hive', BeHive);
