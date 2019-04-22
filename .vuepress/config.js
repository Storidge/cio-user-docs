// /.vuepress/config.js

module.exports = {
    title: '',
    description: "User documentation for Storidge CIO software",
    themeConfig: {
        logo: 'https://storidge.com/wp-content/uploads/2019/04/logo_storidge_automated_2_370x100.png',
        lastUpdated: 'Last Updated',
        editLink: true,
        editLinkText: 'Help us improve this page!',
        sidebarDepth: 2,
        nav: [
            { text: 'Home', link: 'https://storidge.com', },
            { text: 'API', link: 'https://storidge.com/api' },
            { text: 'GitHub', link: 'https://github.com/storidge' }
        ],
        sidebar: [
          {
            title: 'Overview',
            collapsable: true,
            children: [
              '/overview/overview'
            ]
          },
          {
            title: 'Installation',
            collapsable: true,
            children: [
              '/installation/installing_developer_release',
              '/installation/data_drive_requirements',
              '/installation/server_requirements',
              '/installation/how_it_works'
            ]
          },
          {
            title: 'cio CLI',
            collapsable: true,
            children: [
              '/cio_cli/overview',
              '/cio_cli/events',
              '/cio_cli/info',
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
              '/cioctl_cli/join-token',
              '/cioctl_cli/load',
              '/cioctl_cli/node',
              '/cioctl_cli/reboot',
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
              '/docker_volumes/upgrade_cio_volume_plugin',
              '/docker_volumes/about_volume_plugins'
            ]
          },
          {
            title: 'Kubernetes Storage',
            collapsable: true,
            children: [
              '/kubernetes_storage/volumes',
              '/kubernetes_storage/storage_classes'
            ]
          },
          {
            title: 'Cluster',
            collapsable: true,
            children: [
              '/cluster/overview',
              '/cluster/cluster_setup',
              '/cluster/create_a_cluster',
              '/cluster/add_a_node',
              '/cluster/remove_a_node'
            ]
          },
          {
            title: 'Cookbook',
            collapsable: true,
            children: [
              '/cookbook/cio_volume_with_minio',
              '/cookbook/cloud_scale_minio_with_cio'
            ]
          },
          {
            title: 'Cloud Reference Guide',
            collapsable: true,
            children: [
              '/cloud_reference_guide/storidge_on_digitalocean_cloud'
            ]
          },
          {
            title: 'Release Notes',
            collapsable: true,
            children: [
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
