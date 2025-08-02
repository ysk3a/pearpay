<script setup lang="ts">
import { ChartArea, Command, Wallet, NotebookTabs, Users } from 'lucide-vue-next'

import { h, ref } from 'vue'
import NavUser from '@/components/NavUser.vue'
import { Label } from '@/components/ui/label'
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
import { Switch } from '@/components/ui/switch'
import ThemeToggle from './ThemeToggle.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

// This is sample data
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Payroll',
      url: '#',
      icon: Wallet,
      isActive: true,
    },
    {
      title: 'Employee',
      url: '#',
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
  mails: [],
}

const activeItem = ref(data.navMain[0])
const mails = ref(data.mails)
const { setOpen } = useSidebar()
</script>

<template>
  <Sidebar
    class="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
    v-bind="props"
  >
    <!-- This is the first sidebar -->
    <!-- We disable collapsible and adjust width to icon. -->
    <!-- This will make the sidebar appear as icons. -->
    <Sidebar
      collapsible="none"
      class="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" as-child class="md:h-8 md:p-0">
              <a href="#">
                <div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
        <SidebarGroup>
          <SidebarGroupContent class="px-1.5 md:px-0">
            <SidebarMenu>
              <SidebarMenuItem v-for="item in data.navMain" :key="item.title">
                <SidebarMenuButton
                  :tooltip="h('div', { hidden: false }, item.title)"
                  :is-active="activeItem.title === item.title"
                  class="px-2.5 md:px-2"
                  @click="() => {
                    activeItem = item

                    const mail = data.mails.sort(() => Math.random() - 0.5)
                    mails = mail.slice(0, Math.max(5, Math.floor(Math.random() * 10) + 1))
                    setOpen(true)
                  }"
                >
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle/>
        <hr>
        <NavUser :user="data.user" />
      </SidebarFooter>
    </Sidebar>

    <!--  This is the second sidebar -->
    <!--  We disable collapsible and let it fill remaining space -->
    <Sidebar collapsible="none" class="hidden flex-1 md:flex">
      <SidebarHeader class="gap-3.5 border-b p-4">
        <div class="flex w-full items-center justify-between">
          <div class="text-base font-medium text-foreground">
            {{ activeItem.title }}
          </div>
          <Label class="flex items-center gap-2 text-sm">
            <span>Unreads</span>
            <Switch class="shadow-none" />
          </Label>
        </div>
        <SidebarInput placeholder="Type to search..." />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup class="px-0">
          <SidebarGroupContent>
            <!-- <a
              v-for="mail in mails"
              :key="mail.email"
              href="#"
              class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0"
            >
              <div class="flex w-full items-center gap-2">
                <span>{{ mail.name }}</span>
                <span class="ml-auto text-xs">{{ mail.date }}</span>
              </div>
              <span class="font-medium">{{ mail.subject }}</span>
              <span class="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                {{ mail.teaser }}
              </span>
            </a> -->
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </Sidebar>
</template>
