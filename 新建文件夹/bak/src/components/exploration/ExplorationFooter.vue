<template>
  <div class="exploration-footer">
    <ul class="sections unselectable">
      <li class="nav-carousel-control" ref="navCarouseControl">
        <button type="button" @click.prevent="scrollToPrevious" ref="previousBtn" class="nav-carousel-control-btn previous" title="上一页"><span class="sr-only">上一页</span></button>
        <button type="button" @click.prevent="scrollToNext" ref="nextBtn" class="nav-carousel-control-btn next" title="下一页"><span class="sr-only" >下一页</span></button>
        <div class="nav-carousel-scroll-pane" ref="navCarouselScrollPane">
          <ul>
            <li v-for="section, index in sections" class="section static">
              <exploration-navigation-tab
                :canDelete="sections.length > 1 && editable"
                :editable="editable"
                :id="section.id"
                :index="index"
                :section="section.name"
                :selected="section.id === selectedId" @select="tabSelect" @move="tabMove" @delete="tabDelete" data-drag="sections" :data-index="index" @beginEdit="tabBeginEdit" @rename="tabRename"></exploration-navigation-tab>
            </li>
          </ul>
        </div>
      </li>
      <li class="section create" v-if="editable">
        <button type="button" title="新增" @click.prevent="tabCreate"><span class="sr-only">新增</span></button>
      </li>
    </ul>
  </div><!-- /.exploration-footer -->
</template>
<script>
  import $ from 'jquery'
  import resizeSensor from '@/../lib/resizeSensor'
  import ExplorationNavigationTab from './ExplorationNavigationTab.vue'

  let resizeId = 0

  export default {
    components: {ExplorationNavigationTab},
    name: 'exploration-footer',

    props: {
      editable: Boolean
    },

    mounted () {
      this.resizeSensorId = 'nav_carouse_control_' + resizeId++
      resizeSensor.create(this.$refs['navCarouseControl'], this.resizeSensorId, () => {
        this.updateCarouseWidth()
      })
    },

    beforeDestroy () {
      if (this.resizeSensorId) {
        resizeSensor.destroy(this.resizeSensorId)
      }
    },

    computed: {
      sections () {
        return this.$store.getters['report/currentSections']
      },
      selectedId () {
        return this.$store.state.report.currentSectionId
      }
    },

    methods: {
      tabCreate () {
        this.$store.commit('report/createSection')
        this.$nextTick(() => {
          this.scrollToSelected()
        })
      },

      tabBeginEdit () {
        this.$nextTick(() => {
          this.updateCarouseWidth()
        })
      },

      tabSelect (id) {
        if (this.selectedId !== id) {
          this.$store.commit('report/selectSection', id)
        }
      },

      tabMove (fromIndex, toIndex) {
        this.$store.commit('report/moveSection', {fromIndex, toIndex})
      },

      tabDelete (id) {
        this.$store.commit('report/removeSection', {id})
      },

      tabRename (id, name) {
        this.$store.commit('report/renameSection', {id, name})
        this.$nextTick(() => {
          this.updateCarouseWidth()
        })
      },

      updateCarouseWidth () {
        const $navCarouseControl = $(this.$refs['navCarouseControl'])
        const parentWidth = $navCarouseControl.parent().width()
        const $sections = $navCarouseControl.find('li.section')

        let width = 60
        $sections.each(function () {
          width += $(this).outerWidth(true)
        })

        $navCarouseControl.width(Math.min(width, (parentWidth - 50)))
        this.updateNavButtonVisibility()
      },

      updateNavButtonVisibility () {
        const $navCarouselScrollPane = $(this.$refs['navCarouselScrollPane'])
        const $previousBtn = $(this.$refs['previousBtn'])
        const $nextBtn = $(this.$refs['nextBtn'])

        $previousBtn.prop('disabled', false)
        $nextBtn.prop('disabled', false)
        if ($navCarouselScrollPane.scrollLeft() === 0) {
          $previousBtn.prop('disabled', true)
        }
        if (Math.abs($navCarouselScrollPane.scrollLeft() + $navCarouselScrollPane.width() - $navCarouselScrollPane[0].scrollWidth) <= 2) {
          $nextBtn.prop('disabled', true)
        }
      },

      scrollTo ($el) {
        if ($el && $el.length > 0) {
          this.scrolling = true
          const $navCarouselScrollPane = $(this.$refs['navCarouselScrollPane'])
          const $sections = $navCarouselScrollPane.find('li.section')
          const offsetLeft = $el.position().left - this.getLeftmostScrollChildOffset($sections)
          $navCarouselScrollPane.animate({
            scrollLeft: offsetLeft
          }, 250, () => {
            this.updateNavButtonVisibility()
            this.scrolling = false
          })
        }
      },

      scrollToSelected () {
        if (!this.scrolling) {
          const $navCarouselScrollPane = $(this.$refs['navCarouselScrollPane'])
          const $selected = $navCarouselScrollPane.find('li.selected')
          this.scrollTo($selected)
        }
      },

      scrollToLast () {
        const $navCarouselScrollPane = $(this.$refs['navCarouselScrollPane'])
        const $sections = $navCarouselScrollPane.find('li.section')
        const $el = $sections.last()
        this.scrollTo($el)
      },

      scrollToNext () {
        const $navCarouselScrollPane = $(this.$refs['navCarouselScrollPane'])
        const $sections = $navCarouselScrollPane.find('li.section')
        const offsetLeft = $navCarouselScrollPane.scrollLeft() + $navCarouselScrollPane.width() + this.getLeftmostScrollChildOffset($sections)

        let $el
        for (let i = 0; i < $sections.length; i++) {
          $el = $sections.eq(i)
          if ($el && ($el.position().left + $el.width() > offsetLeft)) {
            this.scrollTo($el)
            break
          }
        }
      },

      scrollToPrevious () {
        const $navCarouselScrollPane = $(this.$refs['navCarouselScrollPane'])
        const $sections = $navCarouselScrollPane.find('li.section')
        const offsetLeft = $navCarouselScrollPane.scrollLeft() - $navCarouselScrollPane.width() + this.getLeftmostScrollChildOffset($sections)

        let $el
        for (let i = 0; i < $sections.length; i++) {
          $el = $sections.eq(i)
          if ($el && ($el.position().left >= offsetLeft)) {
            this.scrollTo($el)
            break
          }
        }
      },

      getLeftmostScrollChildOffset ($el) {
        return $el.length > 0 ? $el.eq(0).position().left : 0
      }
    },

    watch: {
      sections () {
        this.$nextTick(() => {
          this.updateCarouseWidth()
        })
      }
    }
  }
</script>
