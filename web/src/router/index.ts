import { createMemoryHistory, createRouter } from 'vue-router'
import LegalDisclosure from '@/views/legal-disclosure.vue';
import Home from '@/views/home.vue';
import PrivacyPolicy from '@/views/privacy-policy.vue';


const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/legal-disclosure",
      name: "Legal Disclosure",
      component: () => import('@/views/legal-disclosure.vue')
    },
    {
      path: "/privacy-policy",
      name: "Privacy Policy",
      component: () => import('@/views/privacy-policy.vue')
    }
  ]
});

export default router;
