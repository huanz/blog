/**
 * Created by w3cboy on 14-3-17.
 */
var Contact = {
    Models: {},
    Collections: {},
    Views: {}
};

Contact.Models.Dialog = Backbone.Model.extend({
    defaults:{
        dialogId: '',
        title: '',
        html: '',
        btnvalue: ''
    }
});
Contact.Views.Dialog = Backbone.View.extend({
    template: _.template($("#tmp-dialog").html()),
    initialize:function(){
        //this.listenTo(this.model, 'change', this.render);
    },
    render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        $('body').append(this.$el);
        $('#'+this.model.get("dialogId")).modal('show');
        return this;
    }
});
Contact.Models.Member = Backbone.Model.extend({
    defaults:{
        name: '',
        mobile: '',
        email: '',
        selected: false
    },
    //切换选中
    toggle: function(){
        this.set({
            selected: !this.get('selected')
        });
    }
});
Contact.Collections.Member = Backbone.Collection.extend({
    model: Contact.Models.Member,
    localStorage: new Backbone.LocalStorage("w3cboy-contact"),
    // 获取已选model
    selected : function() {
        return this.filter(function(itm) {
            return itm.get('selected');
        });
    },
    // 根据关键词搜索
    serachByKeyWord:function(keyword){
        var pattern = new RegExp($.trim(keyword).toLocaleLowerCase());
        return this.filter(function(itm){
            var name = itm.get('name').toLocaleLowerCase(),
                mobile = itm.get('mobile');
            return pattern.test(name) || pattern.test(mobile);
        });
    }
});

Contact.Views.Member = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($("#tmp-memberlist").html()),
    events:{
        'click input': 'toggleSelect',
        'click .contact-edit':'editMember',
        'click .contact-del':'deleteMember'
    },
    initialize:function(opts){
        this.mainView = opts.mainView;
        this.listenTo(this.model,'change',this.render);
        this.listenTo(this.model, 'destroy', this.remove);
    },
    render:function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },
    //切换选中样式
    toggleSelect:function(){
        this.model.toggle();
        this.mainView.chooseStatus();
    },
    //编辑联系人
    editMember:function(){
        var _this = this;
        var item = {
            dialogId: 'editDialog',
            title: '修改联系人',
            html: _.template($("#tmp-member").html(), this.model.toJSON()),
            btnvalue: '修改'
        };
        _this.mainView.dialog.model = new Contact.Models.Dialog(item);
        _this.mainView.dialog.render();
        $("#subBtn").unbind();
        $("#subBtn").bind("click",function(){
            var $name = $("#inputName"),
                $mobile = $("#inputMobile");

            var name = $.trim($name.val()),
                mobile = $.trim($mobile.val()),
                email = $.trim($("#inputEmail").val());

            if(!name){
                $name.focus();
                return false;
            }
            if(!mobile){
                $mobile.focus();
                return false;
            }
            _this.model.set({
                name: name,
                mobile: mobile,
                email: email
            });
            $("#editDialog").modal('hide');
        });
    },
    //移除联系人
    deleteMember:function(){
        this.model.destroy();
        // 联系人个数
        this.mainView.totalMembers();
        this.mainView.chooseStatus();
    }
});

Contact.Views.Main = Backbone.View.extend({
    el: 'body',
    events:{
        'click #contact-add': 'addContact',
        'click #contact-search': 'searchContact',
        'keypress #searchInput': 'searchContact',
        'click #chooseAll': 'chooseAll',
        'click #contact-save': 'saveContact'
    },
    initialize: function(){
        this.$memberWrap = $("#contact-list");
        this.$checkbox = $("#chooseAll");
        //初始化选择
        this.initChoose();
        this.members = new Contact.Collections.Member;
        //初始化弹窗
        this.dialog = new Contact.Views.Dialog;
        //获取localstorage数据
        this.members.fetch();
        //渲染联系人列表
        this.render(this.members);
        this.totalMembers();
    },
    render: function(collection){
        var _this = this,
            listFragment = document.createDocumentFragment();
        collection.each(function(member){
            listFragment.appendChild(_this.renderMemberItem(member));
        });
        this.$memberWrap.html(listFragment);
    },
    renderMemberItem:function(itm){
        var memberView = new Contact.Views.Member({
            model:itm,
            mainView:this
        });
        return memberView.render().el;
    },
    //选中所有/反选
    chooseAll: function(){
        var members = this.searchMembers || this.members;
        var selected = this.$checkbox.prop("checked");
        members.each(function (member) {
            member.set({
                'selected': selected
            });
        });
        this.chooseStatus();
    },
    //选中联系人状态
    chooseStatus: function(){
        var _this = this ;
        var selected = this.searchMembers ? this.searchMembers.selected().length : this.members.selected().length;
        if(selected > 0){
            $("#delStatus").html('已选中'+selected+'个联系人，<a href="javascript:;" id="delMsg">移除选项</a>');
            var item = {
                dialogId:'confirm-modal',
                title: '删除联系人',
                html: '是否删除选中的'+selected+'个联系人？',
                btnvalue: '删除'
            };
            $("#delMsg").bind('click', function(){
                _this.dialog.model = new Contact.Models.Dialog(item);
                _this.dialog.render();
                $("#subBtn").unbind();
                $("#subBtn").bind('click', function(){
                    _this.deleteChoose();
                    $("#confirm-modal").modal('hide');
                });
            });
        }else{
            _this.initChoose();
        }
    },
    // 初始化全选状态
    initChoose: function(){
        $("#delStatus").html('全选');
        $("#chooseAll").prop("checked", false);
    },
    //删除所选
    deleteChoose:function(){
        _.invoke(this.members.selected(), 'destroy');
        this.initChoose();
        this.totalMembers();
        return false;
    },
    // 更新通讯录联系人个数状态
    totalMembers: function(){
        var searchStatus = this.searchMembers ? '，搜索到<span class="badge">'+this.searchMembers.length+'</span>个联系人': '';
        $("#contact-total").html('通讯录共<span class="badge">'+this.members.length+'</span>个联系人'+searchStatus);
    },
    //搜索联系人
    searchContact:function(e){
        if (e.which == 13 || e.which == 1) {
            var keyword = $.trim($("#searchInput").val());
            if(keyword){
                this.searchMembers = new Contact.Collections.Member(this.members.serachByKeyWord(keyword));

                if(this.searchMembers.length < 1){
                    alert('没有搜索到联系人');
                    delete this.searchMembers;
                }else{
                    this.render(this.searchMembers);
                }

            }else{
                delete this.searchMembers;
                this.render(this.members);
            }
            this.totalMembers();
            this.initChoose();
            this.chooseAll();
        }
    },
    // 添加联系人
    addContact:function(){
        var _this = this;
        var member = {
            name: '',
            mobile: '',
            email: ''
        };
        var item = {
            dialogId: 'addDialog',
            title: '添加联系人',
            html: _.template($("#tmp-member").html(), member),
            btnvalue: '添加'
        };
        _this.dialog.model = new Contact.Models.Dialog(item);
        _this.dialog.render();
        $("#subBtn").unbind();
        $("#subBtn").bind("click",function(){
            var $name = $("#inputName"),
                $mobile = $("#inputMobile");

            var name = $.trim($name.val()),
                mobile = $.trim($mobile.val()),
                email = $.trim($("#inputEmail").val());

            if(!name){
                $name.focus();
                return false;
            }
            if(!mobile){
                $mobile.focus();
                return false;
            }
            var member = new Contact.Models.Member({
                name: name,
                mobile: mobile,
                email: email
            });
            // 添加到页面的model中
            _this.members.add(member);
            //添加到页面节点
            _this.$memberWrap.append(_this.renderMemberItem(member));
            // 联系人个数
            _this.totalMembers();
            $("#addDialog").modal('hide')
        });
    },
    // 保存联系人
    saveContact: function(){
        this.members.each(function(member){
            member.save();
        });
        alert("保存成功");
        if(this.searchMembers){
            delete this.searchMembers;
            $("#searchInput").val('');
            this.render(this.members);
            this.totalMembers();
        }
    }
});

new Contact.Views.Main;