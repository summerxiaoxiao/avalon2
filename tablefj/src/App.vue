<template>
  <div id="app" :class="[getTheme,{'expand-nav-view':navExpand}]">
    <div class="landing-controller">
      <div class="main-nav" >
        <div class="nav-logo">
          <i class=" logo ygmat-logo" aria-hidden="true"></i>
        </div>
        <ul class="nav-list" >
          <li v-for="(item,index) in menulist"
              @click.prevent="activeMenu(index,-1,item.url)"
              :title="item.title"  :class="{'hasSub': item.subModules.length > 0, 'active': activeMap.rootHash?item.url===activeMap.rootHash : activeMap.index===index }">
            <a :module="item.module" :href="item.url">
              <i class="ygmat-time" aria-hidden="true"></i><span>{{item.title}}</span>
            </a>
            <ul class="sub-list hide" v-if="item.subModules.length > 0">
              <li @click.stop="activeMenu(index,subIndex,sub.url)" :title="sub.title" :index="subIndex"  v-for="(sub,subIndex) in item.subModules"
                  :class="{'active': activeMap.subHash? activeMap.subHash===sub.url : subIndex===activeMap.subIndex && index===activeMap.index}">
                <a :href="sub.url">
                  <i class="on" aria-hidden="true"></i><span>{{sub.title}}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div class="nav-splitline">
          <i class="expand ygmat-nav_s" title="展开" aria-hidden="true" @click.prevent="expand"></i>
          <i class="closet ygmat-nav_b hide" title="收拢" aria-hidden="true" @click.prevent="expand"></i>
        </div>
        <div class="nav-info">
          <ul class="nav-info-operate">
            <li class="personal-center" title="个人信息"
                @mouseover="showUserInfo(true)"
                @mouseout="showUserInfo(false)">
              <div class="avatar" ><img class="img-circle" alt="" src="/ccf.portal/images/user.png" width="32" height="32"/></div>
              <div class="personalInfo" v-show="activeMap.showUserinfo">
                <ul>
                  <li  class="userName">{{loginName}}</li>
                  <li class="logout-btn" @click.prevent="logout">退出</li>
                </ul>
              </div>
            </li>
            <li class="sys-config" title="设置"><i class="ygmat-install" aria-hidden="true"></i></li>
          </ul>
        </div>
      </div>
      <div class="main-content">
        <router-view></router-view>
      </div>
    </div><!-- /.landing-controller -->
    <vuedal></vuedal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'

  import {default as Vuedals, Component as Vuedal} from 'vuedals'

  Vue.use(Vuedals)

  export default {
    components: {Vuedal},
    name: 'app',
    computed: {
      ...Vuex.mapState({
        'getTheme': state => state.theme,
        'navExpand': state => state.navExpand,
        'menulist': state => state.menulist,
        'loginContext': state => state.loginContext,
        'loginName': state => state.loginName
      })
    },
    data () {
      return {
        activeMap: {
          index: 0,
          subIndex: -1,
          rootHash: '',
          subHash: '',
          showUserinfo: false
        }
      }
    },
    mounted () {
      this.getHash()
    },
    methods: {
      activeMenu (index, subIndex, hash) {
        this.$set(this.activeMap, 'index', index)
        this.$set(this.activeMap, 'subIndex', subIndex)
        this.getHash(hash)
      },
      getHash (hash) {
        var mhash = hash || window.location.hash
        var endIndex = mhash.indexOf('/', mhash.indexOf('/') + 1)
        this.$set(this.activeMap, 'rootHash', mhash.substr(0, endIndex))
        this.$set(this.activeMap, 'subHash', mhash)
      },
      showUserInfo (bz) {
        this.$set(this.activeMap, 'showUserinfo', bz)
      },
      expand () {
        this.$store.commit('setNavExpand', !this.navExpand)
      },
      logout () {
        return this.$store.dispatch('logout')
      }
    }
  }
</script>

