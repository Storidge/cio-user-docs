// /.vuepress/config.js

module.exports = {
    title: '',
    description: "User documentation for Storidge CIO software",
    themeConfig: {
        logo: 'https://storidge.com/wp-content/uploads/2017/06/logowc2d.png',
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
            title: 'Get Started',
            collapsable: true,
            children: [
              '/get_started/installing_developer_release',
              '/get_started/data_drive_requirements',
              '/get_started/server_requirements',
              '/get_started/how_it_works'
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
            title: 'Profiles',
            collapsable: true,
            children: [
              '/profiles/profiles'
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
            title: 'cio commands',
            collapsable: true,
            children: [
              '/cio_commands/events',
              '/cio_commands/info',
              '/cio_commands/node',
              '/cio_commands/nodeid',
              '/cio_commands/profile',
              '/cio_commands/qos',
              '/cio_commands/snapshot',
              '/cio_commands/version',
              '/cio_commands/volume'
            ]
          },
          {
            title: 'cioctl commands',
            collapsable: true,
            children: [
              '/cioctl_commands/create',
              '/cioctl_commands/drive',
              '/cioctl_commands/init',
              '/cioctl_commands/join-token',
              '/cioctl_commands/load',
              '/cioctl_commands/node',
              '/cioctl_commands/reboot',
              '/cioctl_commands/shutdown',
              '/cioctl_commands/unload'
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
