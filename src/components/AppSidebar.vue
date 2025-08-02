<script setup lang="ts">
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'

import { ChartArea, Command, Wallet, NotebookTabs, Users } from 'lucide-vue-next'

import { h, ref } from 'vue'
import NavUser from '@/components/NavUser.vue'
import { Label } from '@/components/ui/label'
// import TeamSwitcher from '@/components/TeamSwitcher.vue'
import ThemeToggle from './ThemeToggle.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  type SidebarProps,
  useSidebar,
} from '@/components/ui/sidebar'
import { useRouter } from 'vue-router'
const router = useRouter();

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navSecondary: [
{
      title: 'Playground',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  navMain: [
    {
      title: 'Payroll',
      url: '/',
      icon: Wallet,
      isActive: true,
    },
    {
      title: 'Employee',
      url: '/employee',
      icon: Users,
      isActive: false,
    },
    {
      title: 'Accounting',
      url: '#',
      icon: NotebookTabs,
      isActive: false,
    },
    {
      title: 'Reports',
      url: '#',
      icon: ChartArea,
      isActive: false,
    },

  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
  mails: [],
}
let activeItem = ref(data.navMain[0])
let mails = ref(data.mails)
const { setOpen } = useSidebar()

function onNavClick(item: any) {
  console.log('::onnavclick', item)
  activeItem.value = item
  setOpen(true)
  router.push(item.url)

}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <!-- <TeamSwitcher :teams="data.teams" /> -->
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child class="md:h-8 md:p-0">
            <a href="#">
              <div
                class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">Acme Inc</span>
                <span class="truncate text-xs">Enterprise</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navSecondary" />
      <NavProjects :projects="data.projects" />
      <SidebarGroup>
        <SidebarGroupContent class="px-1.5 md:px-0">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
              <SidebarMenuButton :tooltip="h('div', { hidden: false }, item.title)"
                :is-active="activeItem.title === item.title" class="px-2.5 md:px-2" @click="onNavClick(item)">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
                <!-- <RouterLink :to="item.url"><span>{{ item.title }}</span></RouterLink> -->
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <ThemeToggle />
      <hr>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
