import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
export function registerMotionPlugins() {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
}
