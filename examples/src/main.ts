import "@soonfx/engine";
import { DemoApp } from "./ui/DemoApp";
 
// Start the UI Application
const app = new DemoApp();

// Wait for DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
 
