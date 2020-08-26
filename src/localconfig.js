// import RedirectView from '~/components/theme/View/RedirectView';
import DiscodataView from '~/components/theme/View/DiscodataView';
import DefaultView from '~/components/theme/View/DefaultView';
import DefaultViewNoHeading from '~/components/theme/View/DefaultViewNoHeading';
import RedirectView from '~/components/theme/View/RedirectView';

import DetailedLinkView from '~/components/manage/Blocks/DetailedLink/View';
import DetailedLinkEdit from '~/components/manage/Blocks/DetailedLink/Edit';

import FolderContentsBlockView from '~/components/manage/Blocks/FolderContentsBlock/View';
import FolderContentsBlockEdit from '~/components/manage/Blocks/FolderContentsBlock/Edit';

import ArticlesListView from '~/components/manage/Blocks/ArticlesList/View';
import ArticlesListEdit from '~/components/manage/Blocks/ArticlesList/Edit';

import ChildrenLinksView from '~/components/manage/Blocks/ChildrenLinks/View';
import ChildrenLinksEdit from '~/components/manage/Blocks/ChildrenLinks/Edit';

import EprtrSidebarBlockEdit from '~/components/manage/Blocks/SidebarBlock/Edit';
import EprtrSidebarBlockView from '~/components/manage/Blocks/SidebarBlock/View';

import EprtrFiltersBlockEdit from '~/components/manage/Blocks/FiltersBlock/Edit';
import EprtrFiltersBlockView from '~/components/manage/Blocks/FiltersBlock/View';

import DiscodataOpenlayersMapBlockEdit from '~/components/manage/Blocks/DiscodataOpenlayersMapBlock/Edit';
import DiscodataOpenlayersMapBlockView from '~/components/manage/Blocks/DiscodataOpenlayersMapBlock/View';

import NavigationBlockEdit from 'volto-tabsview/components/theme/NavigationBlock/Edit';
import NavigationBlockView from 'volto-tabsview/components/theme/NavigationBlock/View';

import BlocksWidget from '~/components/manage/Widgets/BlocksWidget';

import { addCustomGroup } from '~/helpers';

import packSVG from '@plone/volto/icons/pack.svg';
import folderSVG from '@plone/volto/icons/folder.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import listSVG from '@plone/volto/icons/content-listing.svg';
import worldSVG from '@plone/volto/icons/world.svg';

import { SIDEBAR } from '~/constants/Blocks';

export function applyConfig(voltoConfig) {
  const config = { ...voltoConfig };
  addCustomGroup(config, { id: 'eprtr_blocks', title: 'Eprtr Blocks' });

  config.views = {
    ...config.views,
    layoutViews: {
      ...config.views.layoutViews,
      discodata_view: DiscodataView,
      default_view: DefaultView,
      default_view_no_heading: DefaultViewNoHeading,
      redirect_view: RedirectView,
    },
  };

  config.widgets = {
    ...config.widgets,
    id: {
      ...config.widgets.id,
      blocks: BlocksWidget,
      blocks_layout: BlocksWidget,
    },
  };

  config.blocks.blocksConfig.folder_contents = {
    id: 'folder_contents',
    title: 'Folder Contents',
    group: 'eprtr_blocks',
    view: FolderContentsBlockView,
    edit: FolderContentsBlockEdit,
    icon: folderSVG,
  };

  config.blocks.blocksConfig.articles_list = {
    id: 'articles_list',
    title: 'Articles List',
    group: 'eprtr_blocks',
    view: ArticlesListView,
    edit: ArticlesListEdit,
    icon: listSVG,
  };

  config.blocks.blocksConfig.detailed_link = {
    id: 'detailed_link',
    title: 'Detailed Link',
    group: 'eprtr_blocks',
    view: DetailedLinkView,
    edit: DetailedLinkEdit,
    icon: linkSVG,
  };

  config.blocks.blocksConfig.children_links = {
    id: 'children_links',
    title: 'Children Links',
    group: 'eprtr_blocks',
    view: ChildrenLinksView,
    edit: ChildrenLinksEdit,
    icon: linkSVG,
  };

  config.blocks.blocksConfig.navigation_block = {
    id: 'navigation_block',
    title: 'Navigation block',
    group: 'eprtr_blocks',
    view: NavigationBlockView,
    edit: NavigationBlockEdit,
    icon: linkSVG,
  };

  config.blocks.blocksConfig[SIDEBAR] = {
    id: SIDEBAR,
    title: 'Eprtr sidebar block',
    group: 'eprtr_blocks',
    view: EprtrSidebarBlockView,
    edit: EprtrSidebarBlockEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.eprtr_filters_block = {
    id: 'eprtr_filters_block',
    title: 'Eprtr filters block',
    group: 'eprtr_blocks',
    view: EprtrFiltersBlockView,
    edit: EprtrFiltersBlockEdit,
    icon: packSVG,
  };

  config.blocks.blocksConfig.eprtr_openlayers_map_block = {
    id: 'eprtr_openlayers_map_block',
    title: 'Eprtr openlayers map block',
    group: 'eprtr_blocks',
    view: DiscodataOpenlayersMapBlockView,
    edit: DiscodataOpenlayersMapBlockEdit,
    icon: worldSVG,
  };

  return config;
}
