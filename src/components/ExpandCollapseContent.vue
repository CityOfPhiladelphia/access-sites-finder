<template>
  <div class="grid-x grid-padding-x">
    <div class="cell medium-12">
      <div
        v-if="item.attributes.Address"
        class="grid-x detail"
      >
        <div class="small-2">
          <font-awesome-icon icon="map-marker-alt" />
        </div>
        <div class="small-22">
          {{ item.attributes.Address }}<br>
          Philadelphia, PA {{ item.attributes.CODE }} <br>
        </div>
      </div>
    </div>

    <div class="cell medium-12">
      <div
        v-if="item.attributes.Availability"
        class="grid-x detail"
      >
        <div class="small-2">
          <font-awesome-icon :icon="parseIcon(item.attributes.Availability)" />
        </div>
        <div class="small-22">
          {{ parseAvailability(item.attributes.Availability) }}
        </div>
      </div>
    </div>

    <div class="small-24">
      <vertical-table-light
        class="print-padding"
        :slots="mainVerticalTableSlots"
        :options="mainVerticalTableOptions"
      >
        <template
          v-slot:component1
          class="table-slot"
        >
          <div class="td-textbox">
            <span
              class="td-style"
            >
              Registration is required. Fill out the <a
                href="https://www.cognitoforms.com/DHSOST1/AccessCenterRegistrationInterestForm"
                target="_blank"
              >Registration Interest Form <font-awesome-icon icon="external-link-alt" /></a>.
            </span>
          </div>
        </template>
        <template
          v-slot:component2
          class="table-slot"
        >
          <div class="td-textbox">
            <span
              class="td-style"
            >
              Priority will be given to families who work outside of the home and can’t afford or access childcare support.
            </span>
          </div>
        </template>
      </vertical-table-light>
    </div>
    <!-- <div>
      Registration required. <br>
      Fill out the <a
        href="https://www.cognitoforms.com/DHSOST1/AccessCenterRegistrationInterestForm"
        target="_blank">Registration Interest Form
        <font-awesome-icon
          icon="external-link-alt"
        /></a>. <br>
    </div><br> -->
    <!-- <div>
      <p><b>Eligibility:</b> Priority will be given to families who work outside of the home and can’t afford or access childcare support.</p>
    </div> -->
  </div>
</template>

<script>

import SharedFunctions from '@phila/pinboard/src/components/mixins/SharedFunctions.vue';

export default {
  name: 'ExpandCollapseContent',
  components: {
    VerticalTableLight: () => import(/* webpackChunkName: "pvc_VerticalTable3CellsLight" */'@phila/vue-comps/src/components/VerticalTableLight.vue'),
  },
  mixins: [ SharedFunctions ],
  props: {
    item: {
      type: Object,
      default: function(){
        return {};
      },
    },
  },
  computed: {
    mainVerticalTableSlots() {
      let slots = {
        id: 'mainTable',
        fields: [
          {
            label: 'Registration',
            valueType: 'component1',
          },
          {
            label: 'Eligibility',
            valueType: 'component2',
          },
        ],
      };
      // if (this.days.length > 0) {
      //   let newField = {
      //     label: 'testingHours',
      //     labelType: 'i18n',
      //     valueType: 'component2',
      //   };
      //   slots.fields.push(newField);
      // }

      return slots;
    },
    mainVerticalTableOptions() {
      return {
        styles: {
          th: {
            'vertical-align': 'top',
            'font-size': '14px',
            'min-width': '40px !important',
            'max-width': '50px !important',
            'width': '10% !important',
          },
          td: {
            'font-size': '14px !important',
          },
        },
      };
    },

    days() {
      let allDays = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
      let theFields = [];
      // let days = {};

      let item = this.item;
      let holidays = [];
      let exceptions = [];
      if (this.$config.holidays && this.$config.holidays.days) {
        holidays = this.$config.holidays.days;
      }
      if (this.$config.holidays && this.$config.holidays.exceptions) {
        exceptions = this.$config.holidays.exceptions;
      }
      // let siteName = this.getSiteName(this.item);

      for (let [ index, day ] of allDays.entries()) {
        let normallyOpen = item.attributes[day] != null;
        let holidayToday = holidays.includes(day);
        let yesterday = allDays[index-1];
        let normallyOpenYesterday = item.attributes[yesterday] != null;
        let holidayYesterday = holidays.includes(yesterday);
        let siteIsException = exceptions.includes(this.getSiteName(this.item));

        // if (this.item.attributes[day] != null){
        if ((normallyOpen || (!siteIsException && holidayYesterday && normallyOpenYesterday)) && (!holidayToday || siteIsException)) {

          let hours;
          if ((normallyOpen && !holidayToday) || (normallyOpen && siteIsException)) {
            hours = item.attributes[day];
          } else if (!normallyOpen && holidayYesterday) {
            hours = item.attributes[yesterday];
          }

          let dayObject = {
            label: day,
            labelType: 'i18n',
            value: hours,
            // valueType: 'i18n',
          };
          theFields.push(dayObject);
        }
      }
      return theFields;
    },
    component1VerticalTableSlots() {
      return {
        id: 'compTable1',
        fields: this.days,
      };
    },
    component1VerticalTableOptions() {
      return {
        styles: {
          th: {
            'font-size': '14px',
            'min-width': '45px !important',
            'max-width': '50px !important',
            'width': '25% !important',
          },
          td: {
            'font-size': '14px !important',
          },
        },
      };
    },

  },
  methods: {
    parseAvailability(value) {
      let newValue;
      if (value === "Likely Availability") {
        newValue = 'Spaces likely available';
      } else if (value === "No Availability") {
        newValue = 'No spaces available';
      }
      return newValue;
    },
    parseIcon(value) {
      let newValue;
      if (value === "Likely Availability") {
        newValue = 'check';
      } else if (value === "No Availability") {
        newValue = 'times-circle';
      }
      return newValue;
    },
    parseAddress(address) {
      const formattedAddress = address.replace(/(Phila.+)/g, city => `<div>${city}</div>`).replace(/^\d+\s[A-z]+\s[A-z]+/g, lineOne => `<div>${lineOne}</div>`).replace(/,/, '');
      return formattedAddress;
    },
  },
};

</script>

<style lang="scss">

.table-light table {
  margin-left: 0px !important;
}

.td-style {
  font-size: 14px !important;
}

.td-textbox {
  padding-left: 2rem;
}

.location-item {
  position: relative;
  border-bottom: 1px solid black;
  height:100%;

  &:hover::after {
    color: white;
  }

  .temp-close-section {
    width: 100%;
  }

  .card-exclamation-holder {
    padding: 20px;
    background-color: #CC3000;
    text-align: center;
  }

  .fa-icon-class {
    color: white;
    text-align: center;
  }

  .card-exclamation-details {
    padding: 10px;
    background-color: #F5D6CC;
  }

  .location-title {
    cursor: pointer;
    padding: 1rem;
    margin-bottom: 0;
    &:hover{
      background: #2176d2;
      color: white;
    }
  }

  &::after{
    position: absolute;
    right:1rem;
    top: 0;
    content: '+';
    font-weight: 900;
    font-size:1.5rem;
    z-index: 100;
    color: color(dark-ben-franklin)
  }
  &.open{
    h2{
      color:white;
      background-color: color(ben-franklin-blue);
      font-weight: 900;
    }
    &::after{
      content: '-';
      color:white;
    }
  }
  .location-content{
    overflow: hidden;
    height:0;

    &.location-open{
      padding: 1rem;
      height: 100%;
      overflow: initial;
    }
  }
}
</style>
