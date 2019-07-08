<template>  
  <div> 
    <v-layout column>
      <v-container fluid>
        <v-layout row wrap> 
          <v-flex xs12>
            <v-list class="elevation-1">
              <v-list-tile>
                <v-list-tile-action>
                  <v-checkbox v-model="ct_selectAll" color="black" label="All" v-if="isUpdate"></v-checkbox>  
                </v-list-tile-action>
                <v-list-tile-action>
                  <v-tooltip bottom>
                    <v-btn dark @click="fn_sendReturnDialog" slot="activator" v-if="isReturn">
                      <v-icon left>transfer_within_a_station</v-icon> Return User
                    </v-btn>
                    <span>Return User</span>
                  </v-tooltip>  
                </v-list-tile-action>
                <v-list-tile-action>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-tooltip bottom>
                        <v-btn icon @click.native="dialogPrint =! dialogPrint" slot="activator">
                          <v-icon>print</v-icon>
                        </v-btn>
                        <span>Print</span>
                      </v-tooltip>
                    </v-flex>
                  </v-layout>
                </v-list-tile-action>
                <v-spacer></v-spacer>
                <v-list-tile-action>
                  <cs-sort label="Sort" @em_sendSortBy="fn_sortBy" @em_sendSortSeq="fn_sortSeq"></cs-sort>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <br>
            <v-data-table :headers="v_headersDataGrid" :items="items" hide-actions class="elevation-1" :search="vm_filter">
              <template slot="items" slot-scope="props">
                <tr>
                  <td><v-checkbox v-model="w_selected" color="black" :value="props.item.IDX_M_Asset" v-if="isUpdate"></v-checkbox></td>
                  <td>
                    <cs-action-menu 
                      :idx="[props.item.IDX_M_Asset,props.item.AssetID]"
                      :isUpdateTo="'/AssetEdit/'+props.item.AssetID"
                      :isUpdate="props.item.isUpdate"
                      :isDisable="props.item.isDisable"
                      :isAssignUser="props.item.isAssignUser"
                      :isAssignLocation="props.item.isAssignLocation"
                      :isAssignStatus="props.item.isAssignStatus"
                      :isChangeCompany="props.item.isChangeCompany"
                      :isChangeManagement="props.item.isChangeManagement"
                      :items="v_listSpeeddial"
                      @action="fn_actionMenu"
                    ></cs-action-menu>
                  </td>
                  <td>
                    <span class="badge">{{ props.item.AssetID }} 
                        <span v-if="props.item.isEnable" class="badge__badge orange"><v-icon dark>warning</v-icon></span>
                      </span>
                  </td>
                  <td class="text-xs-center">{{ props.item.CurrentAssetUser }}</td>
                  <td class="text-xs-center">{{ props.item.AssetTypeName }}</td>
                  <td class="text-xs-center">{{ props.item.AssetTypeModelName }}</td>
                  <td class="text-xs-center"><v-chip small outline :color="props.item.CurrentColorAssetStatus" style="font-size:10px">{{ props.item.CurrentAssetStatus }}</v-chip></td>
                  <td class="text-xs-center">{{ props.item.CurrentAssetLocation }}</td>
                  <td class="text-xs-center">{{ props.item.CurrentAssetDepartment }}</td>
                  <td class="text-xs-center">{{ props.item.AssetColorName }}</td>
                  <td class="text-xs-center">{{ props.item.CompanyAlias }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>

    <!-- Dialog Print from SSRS -->
    <v-layout row justify-center>
      <v-dialog v-model="dialogPrint" fullscreen transition="dialog-bottom-transition" :overlay="false">            
        <cs-report :IDX="$ls.get('SESSION_ID')" :type="'PrintOut_LaporanAsset'" param="Session_ID"  
        @send-filter="dialogPrint =false" />
      </v-dialog>
    </v-layout>
    
    <!-- Assign Status -->
    <v-dialog v-model="vm_statusDialog" max-width="1024px">
      <v-card>
        <v-card-title class="title">
          Assign Status 
          <v-spacer></v-spacer>
          <v-chip disabled>{{ v_assetID }}</v-chip>
          <v-menu :nudge-width="600" :close-on-content-click="false">
            <v-btn small flat slot="activator">
              <v-icon left>history</v-icon> History
            </v-btn>
            <v-card>
              <v-card-text>
                <v-text-field v-model="vm_searchHistoryStatus" label="Search Status"></v-text-field>
                <v-data-table
                  :headers="v_headersHistoryStatus"
                  :items="v_listHistoryStatus"
                  class="elevation-0"
                  :search="vm_searchHistoryStatus"
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-sm-center">{{ props.item.AssetStatusDate | moment("DD MMM YYYY") }}</td>
                    <td class="text-sm-center">{{ props.item.AssetStatusName }}</td>
                    <td class="text-sm-center">{{ props.item.Remarks }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-select :items="misc[0].Status" required autocomplete clearable
            v-model="vm_selectStatus" label="Choose Status" item-text="AssetStatusName" item-value="IDX_M_AssetStatus"
          ></v-select>
          <v-text-field v-model="vm_remarks" label="Remarks" multi-line></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light @click.native="vm_statusDialog = false">Close</v-btn>
          <v-btn dark class="white--text" :disabled="vm_selectStatus == null ? true : false" 
						@click="fn_sendAssign('assignStatus')" @click.native="vm_statusDialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign Location -->
    <v-dialog v-model="vm_locationDialog" max-width="1024px">
      <v-card>
        <v-card-title class="title">
          Assign Location
          <v-spacer></v-spacer>
          <v-chip disabled>{{ v_assetID }}</v-chip>
          <v-menu :nudge-width="600" :close-on-content-click="false">
            <v-btn small flat slot="activator">
              <v-icon left>history</v-icon> History
            </v-btn>
            <v-card>
              <v-card-text>
                <v-text-field v-model="vm_searchHistoryLocation" label="Search Location"></v-text-field>
                <v-data-table
                  :headers="v_headersHistoryLocation"
                  :items="v_listHistoryLocation"
                  class="elevation-0"
                  :search="vm_searchHistoryLocation"
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-sm-center">{{ props.item.StartDate | moment("DD MMM YYYY") }}</td>
                    <td class="text-sm-center">{{ props.item.EndDate | moment("DD MMM YYYY") }}</td>
                    <td class="text-sm-center">{{ props.item.AssetLocationName }}</td>
                    <td class="text-sm-center">{{ props.item.Remarks }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-select
            :items="misc[1].Location"
            required autocomplete clearable
            v-model="vm_selectLocation"
            label="Choose Location"
            item-text="AssetLocationName"
            item-value="IDX_M_AssetLocation"
          ></v-select>
          <v-text-field v-model="vm_date" type="date" label="Choose Date"></v-text-field>
          <v-text-field
            v-model="vm_remarks"
            label="Remarks"
            multi-line
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light @click.native="vm_locationDialog = false">Close</v-btn>
          <v-btn dark class="white--text" :disabled="vm_selectLocation == null ? true : false" 
						@click="fn_sendAssign('assignLocation')" @click.native="vm_locationDialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign User -->
    <v-dialog v-model="vm_userDialog" max-width="1024px">
      <v-card>
        <v-card-title class="title">
          Assign User
          <v-spacer></v-spacer>
          <v-chip disabled>{{ v_assetID }}</v-chip>
          <v-menu :nudge-width="600" :close-on-content-click="false">
            <v-btn small flat slot="activator">
              <v-icon left>history</v-icon> History
            </v-btn>
            <v-card>
              <v-card-text>
                <v-text-field 
                  prepend-icon="search"
                  label="Search User"
                  v-model="vm_searchHistoryUser"
                ></v-text-field>
                <v-data-table
                  :headers="v_headersHistoryUser"
                  :items="v_listHistoryUser"
                  class="elevation-0"
                  :search="vm_searchHistoryUser"
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-sm-center">{{ props.item.StartDate | moment("DD MMM YYYY") }}</td>
                    <td class="text-sm-center">{{ props.item.EndDate | moment("DD MMM YYYY") }}</td>
                    <td class="text-sm-center">{{ props.item.NIK }}</td>
                    <td class="text-sm-center">{{ props.item.Name }}</td>
                    <td class="text-sm-center">{{ props.item.PositionName }}</td>
                    <td class="text-sm-center">{{ props.item.DepartmentName }}</td>
                    <td class="text-sm-center">{{ props.item.Remarks }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-select
            :items="misc[2].User"
            required autocomplete clearable
            v-model="vm_selectUser"
            label="Choose User"
            item-text="AssetUserName"
            item-value="IDX_M_AssetUser"
          ></v-select>
          <v-text-field v-model="vm_date" type="date" label="Choose Date"></v-text-field>
          <v-text-field
            v-model="vm_remarks"
            label="Remarks"
            multi-line
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light flat @click.native="vm_userDialog = false">Close</v-btn>
          <v-btn dark class="white--text" :disabled="vm_selectUser == null ? true : false" 
						@click="fn_sendAssign('assignUser')" @click.native="vm_userDialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Return Dialog -->
    <v-dialog v-model="vm_returnUserDialog" max-width="290px">
      <v-card>
        <v-card-title class="title">
          Remarks
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field v-model="vm_remarksReturnUser" label="Remarks" multi-line></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light flat @click.native="vm_returnUserDialog = false">Close</v-btn>
          <v-btn dark class="white--text" @click="fn_sendReturnMultiple" @click.native="vm_returnUserDialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign Management -->
    <v-dialog v-model="vm_managementDialog" max-width="1024px">
      <v-card>
        <v-card-title class="title">
          Change Management
          <v-spacer></v-spacer>
          <v-chip disabled>{{ v_assetID }}</v-chip>
          <v-menu :nudge-width="600" :close-on-content-click="false">
            <v-btn small flat slot="activator">
              <v-icon left>history</v-icon> History
            </v-btn>
            <v-card>
              <v-card-text>
                <v-text-field 
                  prepend-icon="search"
                  label="Search User"
                  v-model="vm_searchHistoryManagement"
                ></v-text-field>
                <v-data-table
                  :headers="v_headersHistoryManagement"
                  :items="v_listHistoryManagement"
                  class="elevation-0"
                  :search="vm_searchHistoryManagement"
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-sm-center">{{ props.item.AssetManagementDate | moment("DD MMM YYYY") }}</td>
                    <td class="text-sm-center">{{ props.item.AssetManagementName }}</td>
                    <td class="text-sm-center">{{ props.item.Remarks }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-select
            :items="misc[3].Management"
            required
            autocomplete
            clearable
            v-model="vm_selectManagement"
            label="Choose Management"
            item-text="AssetManagementName"
            item-value="IDX_M_AssetManagement"
          ></v-select>
          <v-text-field
            v-model="vm_remarks"
            label="Remarks"
            multi-line
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light flat @click.native="vm_managementDialog = false">Close</v-btn>
          <v-btn dark class="white--text" :disabled="vm_selectManagement == null ? true : false" 
						@click="fn_sendAssign('assignManagement')" @click.native="vm_managementDialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Assign Company -->
    <v-dialog v-model="vm_companyDialog" max-width="1024px">
      <v-card>
        <v-card-title class="title">
          Change Company
          <v-spacer></v-spacer>
          <v-chip disabled>{{ v_assetID }}</v-chip>
          <v-menu :nudge-width="600" :close-on-content-click="false">
            <v-btn small flat slot="activator">
              <v-icon left>history</v-icon> History
            </v-btn>
            <v-card>
              <v-card-text>
                <v-text-field 
                  prepend-icon="search"
                  label="Search Company"
                  v-model="vm_searchHistoryCompany"
                ></v-text-field>
                <v-data-table
                  :headers="v_headersHistoryCompany"
                  :items="v_listHistoryCompany"
                  class="elevation-0"
                  :search="vm_searchHistoryCompany"
                >
                  <template slot="items" slot-scope="props">
                    <td class="text-sm-center">{{ props.item.AssetCompanyDate | moment("DD MMM YYYY") }}</td>
                    <td class="text-sm-center">{{ props.item.CompanyName }}</td>
                    <td class="text-sm-center">{{ props.item.Remarks }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-menu>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-select
            :items="misc[4].Company"
            required
            autocomplete
            clearable
            v-model="vm_selectCompany"
            label="Choose Company"
            item-text="CompanyName"
            item-value="IDX_M_Company"
          ></v-select>
          <v-text-field
            v-model="vm_remarks"
            label="Remarks"
            multi-line
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn light flat @click.native="vm_companyDialog = false">Close</v-btn>
          <v-btn dark class="white--text" :disabled="vm_selectCompany == null ? true : false" 
						@click="fn_sendAssign('assignCompany')" @click.native="vm_companyDialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import CsActionMenu from '@/components/custom/CsActionMenu';
  import CsSort from "@/components/custom/CsSort";
  import CsReport from "@/components/custom/CsReport";

  export default {
    name: 'cs-data-grid',
    components: {
      'cs-sort': CsSort,
      'cs-action-menu': CsActionMenu,
      'cs-report': CsReport
    },
    props: {
      items: {
        required: true,
        type: Array
      },
      isInsert: [Boolean,Number,String],
      isUpdate: [Boolean,Number,String],
      isDelete: [Boolean,Number,String],
      isReturn: [Boolean,Number,String],
      misc: {
        type: [Array]
      },
      showSelect: {
        type: Boolean,
        default: false
      },
    },
    watch:{
      w_selected(){
        if (this.w_selected.length > 0) {
          this.vm_actionVisible = true;
          this.vm_sortVisible = false;
        } else {
          this.vm_sortVisible = true;
          this.vm_actionVisible = false;
        }
      },
    },
    computed: {
      ct_selectAll: {
        get: function() {
          return this.items ? this.w_selected.length == this.items.length : false;
        },
        set: function(value) {
          var selected = [];
          if (value) {
            this.items.forEach(function(item) {
              selected.push(item.IDX_M_Asset);
            });
          }
          this.w_selected = selected;
        }
      },
      serviceURL() {
        return this.$aid.url();
      },
    },
    data() {
        return {
          v_assetID: null,
          v_idx: null,
          v_listSpeeddial: [
            {
              Dark: true,
              Color: 'green darken-1',
              Code: null,
              Text: 'Check History',
              Icon: 'history',
              To: '/AssetHistory/',
            },
            {
              Dark: true,
              Color: 'blue darken-1',
              Code: null,
              Text: 'Detail',
              Icon: 'details',
              To: '/AssetDetail/',
            },
          ],
          v_listHistoryStatus:[],
          v_listHistoryLocation:[],
          v_listHistoryUser:[],
          v_listHistoryManagement:[],
          v_listHistoryCompany:[],
          v_headersHistoryStatus: [
            { text: 'Date', align: 'center', sortable: true, value: 'AssetStatusDate' },
            { text: 'Status', align: 'center', sortable: true, value: 'AssetStatusName' },
            { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
          ],
          v_headersHistoryLocation: [
            { text: 'Start Date', align: 'center', sortable: true, value: 'StartDate' },
            { text: 'End Date', align: 'center', sortable: true, value: 'EndDate' },
            { text: 'Location', align: 'center', sortable: true, value: 'AssetLocationName' },
            { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
          ],
          v_headersHistoryUser: [
            { text: 'Start Date', align: 'center', sortable: true, value: 'StartDate' },
            { text: 'End Date', align: 'center', sortable: true, value: 'EndDate' },
            { text: 'NIK', align: 'center', sortable: true, value: 'NIK' },
            { text: 'Name', align: 'center', sortable: true, value: 'Name' },
            { text: 'Position', align: 'center', sortable: true, value: 'PositionName' },
            { text: 'Deparment', align: 'center', sortable: true, value: 'DepartmentName' },
            { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
          ],
          v_headersHistoryManagement: [
            { text: 'Date', align: 'center', sortable: true, value: 'AssetManagementDate' },
            { text: 'Management', align: 'center', sortable: true, value: 'AssetManagementName' },
            { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
          ],
          v_headersDataGrid: [
            { text: '', align: 'center', sortable: false },
            { text: 'Action', align: 'center', sortable: false },
            { text: 'Asset ID', align: 'center', value: 'AssetID' },
            { text: 'User', align: 'center', value: 'CurrentAssetUser' },
            { text: 'Type', align: 'center', value: 'AssetTypeModel' },
            { text: 'Model', align: 'center', value: 'AssetTypeModelName' },
            { text: 'Status', align: 'center', value: 'CurrentAssetStatus' },
            { text: 'Location', align: 'center', value: 'CurrentAssetLocation' },
            { text: 'Department', align: 'center', value: 'CurrentAssetDepartment' },
            { text: 'Color', align: 'center', value: 'CurrentAssetColor' },
            { text: 'Company', align: 'center', value: 'CompanyAlias' },
          ],
          v_headersHistoryCompany: [
            { text: 'Company Date', align: 'center', sortable: true, value: 'AssetCompanyDate' },
            { text: 'Company Name', align: 'center', sortable: true, value: 'CompanyName' },
            { text: 'Remarks', align: 'center', sortable: true, value: 'Remarks' },
          ],
          vm_searchHistoryStatus: null,
          vm_searchHistoryLocation: null,
          vm_searchHistoryUser: null,
          vm_searchHistoryManagement: null,
          vm_searchHistoryCompany: null,
          vm_sortVisible: false,
          vm_actionVisible: false,

          vm_statusDialog: false,
          vm_locationDialog: false,
          vm_userDialog: false,
          vm_managementDialog: false,
          vm_companyDialog: false,
          vm_returnUserDialog: false,

          vm_menuLocation: false,
          vm_menuUser: false,
          vm_date: this.$moment(new Date()).format("YYYY-MM-DD"),
          vm_selectStatus: null,
          vm_selectLocation: null,
          vm_selectUser: null,
          vm_selectManagement: null,
          vm_selectCompany: null,
          vm_remarks: null,
          vm_remarksReturnUser: null,
          w_selected:[],
          vm_filter: null,
          pagination: {
            sortBy: 'name'
          },
          dialogPrint: false,
        }
    },
    methods:{
      loadHistoryStatus(idx){
        let id = JSON.stringify({ IDX_M_Asset: idx });
        this.$http
        .post(this.$aid.url() + "ManageAsset/loadAdditionalStatus_ByIDXAsset", id)
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.v_listHistoryStatus = arr['Table'];
        })
        .catch(function(error) {
          this.$aid.console(error.body,false);
        });
      },
      loadHistoryLocation(idx){
        let id = JSON.stringify({ IDX_M_Asset: idx });
        this.$http
        .post(this.$aid.url() + "ManageAsset/loadAdditionalLocation_ByIDXAsset", id)
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.v_listHistoryLocation = arr['Table'];
        })
        .catch(function(error) {
          this.$aid.console(error.body,false);
        });
      },
      loadHistoryUser(idx){
        let id = JSON.stringify({ IDX_M_Asset: idx });
        this.$http
        .post(this.$aid.url() + "ManageAsset/loadAdditionalUser_ByIDXAsset", id)
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.v_listHistoryUser = arr['Table'];
        })
        .catch(function(error) {
          this.$aid.console(error.body,false);
        });
      },
      loadHistoryManagement(idx){
        let id = JSON.stringify({ IDX_M_Asset: idx });
        this.$http
        .post(this.$aid.url() + "ManageAsset/loadAdditionalManagement_ByIDXAsset", id)
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.v_listHistoryManagement = arr['Table'];
        })
        .catch(function(error) {
          this.$aid.console(error.body,false);
        });
      },
      loadHistoryCompany(idx){
        let id = JSON.stringify({ IDX_M_Asset: idx });
        this.$http
        .post(this.$aid.url() + "ManageAsset/loadAdditionalCompany_ByIDXAsset", id)
        .then(function(response) {
          var arr = JSON.parse(response.data);
          this.v_listHistoryCompany = arr['Table'];
        })
        .catch(function(error) {
          this.$aid.console(error.body,false);
        });
      },
      fn_sortBy(params){
        this.$emit('em_sendSortBy',params);
      },
      fn_sortSeq(params){
        this.$emit('em_sendSortSeq',params);
      },
      fn_actionMenu(params){
        let IDX_M_Asset = params[1][0];
        let AssetID = params[1][1];
        let Code = params[0];
        this.vm_remarks = null;
        this.v_idx = IDX_M_Asset;
        this.v_assetID = AssetID;

        switch (Code){
          case 'isAssignUser': 
            this.vm_selectUser = null;
            this.vm_userDialog = true;
            this.vm_date = this.$moment(new Date()).format("YYYY-MM-DD");
            this.loadHistoryUser(IDX_M_Asset);
            return false;
          break;
          case 'isAssignLocation': 
            this.vm_selectLocation = null;
            this.vm_locationDialog = true;
            this.vm_date = this.$moment(new Date()).format("YYYY-MM-DD");
            this.loadHistoryLocation(IDX_M_Asset);
            return false;
          break;
          case 'isAssignStatus': 
            this.vm_selectStatus = null;
            this.vm_statusDialog = true;
            this.loadHistoryStatus(IDX_M_Asset);
            return false;
          break;
          case 'isChangeManagement': 
            this.vm_selectManagement = null;
            this.vm_managementDialog = true;
            this.loadHistoryManagement(IDX_M_Asset);
            return false;
          break;
          case 'isChangeCompany': 
            this.vm_selectCompany = null;
            this.vm_companyDialog = true;
            this.loadHistoryCompany(IDX_M_Asset);
            return false;
          break;
          case 'isDisable': 
            this.fn_sendAssign('isDisable');
          break;
        }
      },
      fn_sendAssign(params){
        let id;
        switch (params){
          case 'assignStatus':
            id = JSON.stringify({
              Session_ID: this.$ls.get('SESSION_ID'),
              IDX_M_Asset: this.v_idx,
              IDX_M_AssetStatus: this.vm_selectStatus,
              Remarks: this.vm_remarks
            });
          break;
          case 'assignLocation':
            id = JSON.stringify({
              Session_ID: this.$ls.get('SESSION_ID'),
              IDX_M_Asset: this.v_idx,
              IDX_M_AssetLocation: this.vm_selectLocation,
              Date: this.vm_date,
              Remarks: this.vm_remarks
            });
          break;
          case 'assignUser':
            id = JSON.stringify({
              Session_ID: this.$ls.get('SESSION_ID'),
              IDX_M_Asset: this.v_idx,
              IDX_M_AssetUser: this.vm_selectUser,
              Date: this.vm_date,
              Remarks: this.vm_remarks
            });
          break;
          case 'assignManagement':
            id = JSON.stringify({
              Session_ID: this.$ls.get('SESSION_ID'),
              IDX_M_Asset: this.v_idx,
              IDX_M_AssetManagement: this.vm_selectManagement,
              Remarks: this.vm_remarks
            });
          break;
          case 'assignCompany':
            id = JSON.stringify({
              Session_ID: this.$ls.get('SESSION_ID'),
              IDX_M_Asset: this.v_idx,
              IDX_M_Company: this.vm_selectCompany,
              Remarks: this.vm_remarks
            });
          break;
          case 'isDisable':
            id = JSON.stringify({
              Session_ID: this.$ls.get('SESSION_ID'),
              IDX_M_Asset: this.v_idx
            })
          break;
        }
        this.$emit('em_sendActionMenu',[params,id]);
      },
      fn_sendPO(v){
        this.$emit('em_sendPO',v);
      },
      fn_sendPrint(){

      },
      fn_sendReturnMultiple(){
        if(this.w_selected.length == 0){
          this.$emit('em_sendAlert','Choose asset first..');
          return false;
        }
        this.$emit('em_sendReturn',[this.w_selected,this.vm_remarksReturnUser]);
      },
      fn_sendReturnDialog(){
        if(this.w_selected.length == 0){
          this.$emit('em_sendAlert','Choose asset first..');
          return false;
        }
        this.vm_returnUserDialog = true;
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    }
  }
</script>