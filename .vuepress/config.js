// /.vuepress/config.js

module.exports = {
    title: '',
    description: "User documentation for Storidge CIO software",
    plugins: [
      [
        '@vuepress/google-analytics',
        {
          'ga': 'UA-102974094-1' // UA-00000000-0
        }
      ],
      {
        'sitemap': {
          hostname: 'https://pake.web.id'
        },
      }
    ],
    themeConfig: {
//        logo: 'https://storidge.com/wp-content/uploads/2019/04/logo_storidge_automated_2_370x100.png',
        lastUpdated: 'Last Updated',
        editLink: true,
        editLinkText: 'Help us improve this page!',
        sidebarDepth: 2,
        nav: [
            { text: 'Home', link: 'https://storidge.com', },
            { text: 'Guide', link: 'https://guide.storidge.com' },
            { text: 'FAQ', link: 'https://faq.storidge.com' },
            { text: 'API', link: 'https://storidge.com/api' },
            { text: 'Support', link: 'https://storidge.com/support' }
        ],
        sidebar: [
          ['/', 'Docs Home'],
          {
            title: 'Introduction',
            collapsable: true,
            children: [
              '/introduction/how_it_works',
              '/introduction/features',
              '/introduction/alternatives'
            ]
          },
          {
            title: 'cio CLI',
            collapsable: true,
            children: [
              '/cio_cli/overview',
              '/cio_cli/capacity',
              '/cio_cli/event',
              '/cio_cli/info',
              '/cio_cli/network',
              '/cio_cli/node',
              '/cio_cli/nodeid',
              '/cio_cli/profile',
              '/cio_cli/qos',
              '/cio_cli/snapshot',
              '/cio_cli/version',
              '/cio_cli/volume'
            ]
          },
          {
            title: 'cioctl CLI',
            collapsable: true,
            children: [
              '/cioctl_cli/overview',
              '/cioctl_cli/create',
              '/cioctl_cli/drive',
              '/cioctl_cli/init',
              '/cioctl_cli/join',
              '/cioctl_cli/join-token',
              '/cioctl_cli/load',
              '/cioctl_cli/migrate',
              '/cioctl_cli/node',
              '/cioctl_cli/report',
              '/cioctl_cli/reboot',
              '/cioctl_cli/rebuild',
              '/cioctl_cli/shutdown',
              '/cioctl_cli/unload'
            ]
          },
          {
            title: 'Docker Volumes',
            collapsable: true,
            children: [
              '/docker_volumes/volumes',
              '/docker_volumes/volumes_for_containers',
              '/docker_volumes/volumes_for_services',
              '/docker_volumes/volumes_for_docker_compose',
              '/docker_volumes/volumes_and_dockerfiles',
              '/docker_volumes/volumes_with_ansible',
              '/docker_volumes/install_volume_plugin',
              '/docker_volumes/upgrade_cio_volume_plugin'
            ]
          },
          {
            title: 'Kubernetes Storage',
            collapsable: true,
            children: [
              '/kubernetes_storage/kubernetes_storage',
              '/kubernetes_storage/storage_classes',
              '/kubernetes_storage/install_csi_driver'
            ]
          },
          {
            title: 'Guidebook',
            collapsable: true,
            children: [
              '/guidebook/cio_volume_with_minio',
              '/guidebook/cloud_scale_minio_with_cio',
              '/guidebook/storidge_with_minikube'
            ]
          },
          {
            title: 'Integrations',
            collapsable: true,
            children: [
              '/integrations/grafana',
              '/integrations/packer',
              '/integrations/portainer',
              '/integrations/prometheus'
            ]
          },
          {
            title: 'Operations',
            collapsable: true,
            children: [
              '/operations/snapshots'
            ]
          },
          {
            title: 'Cloud Reference',
            collapsable: true,
            children: [
              '/cloud_reference/kubernetes_storidge_aws',
              '/cloud_reference/swarm_storidge_aws',
              '/cloud_reference/swarm_storidge_digitalocean',
              '/cloud_reference/swarm_storidge_vsphere'
            ]
          },
          {
            title: 'Prerequisites',
            collapsable: true,
            children: [
              '/prerequisites/hardware',
              '/prerequisites/software',
              '/prerequisites/ports',
              '/prerequisites/packages'
            ]
          },
          {
            title: 'Release Notes',
            collapsable: true,
            children: [
              '/release_notes/release_1.0.0-3107.md',
              '/release_notes/release_1.0.0-3085.md',
              '/release_notes/release_1.0.0-3074.md',
              '/release_notes/release_1.0.0-3062.md',
              '/release_notes/release_1.0.0-3055.md',
              '/release_notes/release_1.0.0-3007.md',
              '/release_notes/release_1.0.0-2984.md',
              '/release_notes/release_1.0.0-2972.md',
              '/release_notes/release_1.0.0-2942.md',
              '/release_notes/release_1.0.0-2926.md',
              '/release_notes/release_1.0.0-2887.md',
              '/release_notes/release_1.0.0-2859.md',
              '/release_notes/release_1.0.0-2825.md',
              '/release_notes/release_1.0.0-2803.md',
              '/release_notes/release_0.9.0-2762.md',
              '/release_notes/release_0.9.0-2745.md',
              '/release_notes/release_0.9.0-2653.md',
              '/release_notes/release_0.9.0-2618.md',
              '/release_notes/release_0.9.0-2466.md',
              '/release_notes/release_0.9.0-2428.md',
              '/release_notes/release_0.9.0-2361.md',
              '/release_notes/release_0.9.0-2326.md'
            ]
          }
        ]
    }
}
