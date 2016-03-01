title: phpcms关键代码分享 
date: 2014-01-19 00:32:32
tags: [phpcms,php]
categories: technology
---

## 导航栏

**导航栏增加选中样样式**

```php	
{if $r[catid]==$CATEGORYS[$parentid][catid]||$r[catid]==$catid} class="nav_bg" {/if}
```

**点击父栏目跳转到第一个子栏目**

```php
{pc:content action="category" catid="0" num="7" siteid="$siteid" order="listorder ASC"}
    {loop $data $r}
        {if count(subcat($r[catid])) > 0}
            <!--获取第一个子类的 url 字段值-->
            {php $zi_arr = explode(',',$r[arrchildid])}
            {php $url = $CATEGORYS[$zi_arr[1]][url]}
            <!--否则直接得到当前的url-->
        {else}
            {php $url  = $r[url]}
        {/if}
        <li {if $r[catid]==$CATEGORYS[$CAT[parentid]][catid]||$r[catid]==$catid} class="nav_bg" {/if}>
            <a href="{$url}">{$r[catname]}</a>
        </li>
    {/loop}
{/pc}
```

<!-- more -->

## 获取栏目图片

```php
{if $top_parentid}
    {php $c_id=$top_parentid}
{else}
    {php $c_id=$catid}
{/if}
{pc:content action="category" catid="$c_id" siteid="$siteid" order="listorder ASC" num="1"}
    {loop $data $r}
        {php echo $r[image]}
        <img src="{thumb($r['image'],964,200)}"  alt="{$r['catname']}" width="964" height="200">
    {/loop}
{/pc}
```

## 获取父栏目名称及链接地址

**方法一：**

```php
{$CATEGORYS[$CAT[parentid]][catname]}
{$CATEGORYS[$CAT[parentid]][url]}
```

**方法二：**

```php
{$CATEGORYS[$top_parentid][catname]}
{$CATEGORYS[$top_parentid][url]}
```

## 获取子栏目

```php
{pc:content action="category" catid="$parentid" num="10" siteid="$siteid" order="listorder ASC"}
    {loop $data $r}
        <li {if $catid==$r[catid]}class="left_bg"{/if}><a href="{$r[url]}">{$r[catname]}</a></li>
    {/loop}
{/pc}
```

## 获取当前位置及在列表页调用内容

```php
{catpos($catid)}
```
   
列表页调用内容在PC标签加参数 moreinfo="1"

## 游客投稿到所有分类信息和栏目

`modules/member/classes/foreground.class.php`第10行

```php
if(substr(ROUTE_A, 0, 7) != 'public_')) {
    self::check_member();
}
```
改为：
        
```php
if(substr(ROUTE_A, 0, 7) != 'public_' && (ROUTE_A!= 'publish'|| ROUTE_A!= 'info_publish')) {
    self::check_member();
}
```
即可让游客投稿，(后台要设置游客有投稿状态)

`/phpcms/modules/member/content.php`270行左右，有关分类信息投稿：

```php
public function info_publish() {
    $memberinfo = $this->memberinfo;
    $grouplist = getcache('grouplist');
    $SEO['title'] = L('info_publish','','info');
    //判断会员组是否允许投稿
    //在此加上：
    if(!$memberinfo['groupid']) $memberinfo['groupid']=8;
```

有关其它模型投稿在`/phpcms/modules/member/content.php`行19左右也加入：

```php
if(!$memberinfo['groupid']) $memberinfo['groupid']=8;
```

## 修改单页模型实现单页添加描述（description）和缩略图（thumb）功能

首先在page表新建字段thumb和description：

修改`phpcms\modules\content\templates\content_page.tpl.php`在第48行下添加如下代码：

```html
<tr>
    <th width="80"><?php echo L('description');?></th>             
    <td>
        <textarea name="info[description]" id="description" style="width:98%;height:46px;" onkeyup="strlen_verify(this, 'description_len', 255)"><?php echo $description;?></textarea>还可输入<b><span id="description_len">255</span></b>个字符
    </td>
</tr>
<tr>
    <th width="80"><?php echo L('thumb');?></th>
    <td><?php echo form::images('info[thumb]', 'thumb', $thumb, 'content');?></td>
</tr>
```
    
## 修改单页父栏目无法添加内容问题

打开`phpcms\modules\content\content.php`搜索`$strs2`，定位到第二个。我们会看到这样的代码：

```php
$strs2 = "<span class='folder'>\$catname</span>";
```

然后将这段代码修改为：

```php
$strs2= "<span class='folder'>\$add_icon<a href='?m=content&c=content&a=\$type&menuid=".$_GET['menuid']."&catid=\$catid' target='right' onclick='open_list(this)'>\$catname</a></span>";
```

打开`content.php`同文件夹下的`create_html.php`，可以搜索`$r['disabled']`，找到：

```php
$r['disabled'] = $r['child'] ? 'disabled' : '';
```
    
然后将这一段代码注释掉或者删除。

然后进后台更新缓存，可以编辑单页page父栏目了。

## 外部链接添加子栏目在管理内容中不能显示解决方法

将`phpcms\modules\content\content.php`第481行

```php
if($r['siteid']!=$this->siteid || ($r['type']==2 && $r['child']==0)) continue;
```

改为：

```php
if($r['siteid']!=$this->siteid) continue;
```

## 修改后台登陆路径

在网站根目录创建一个文件夹，以后就要通过这个文件夹进入后台登录界面的，所以文件夹名就要取一个不易被人轻易猜到的名称。这里作为演示，我就取为myweb 好了。接着，在这个文件夹里新建一个文件index.php，内容为：

```php
<?php 
    define('PHPCMS_PATH', realpath(dirname(__FILE__) . '/..') . '/');
    include PHPCMS_PATH . '/phpcms/base.php';
    // pc_base::creat_app();
    $session_storage = 'session_' . pc_base :: load_config('system', 'session_storage');
    pc_base :: load_sys_class($session_storage);
    session_start();
    $_SESSION['right_enter'] = 1;
    unset($session_storage);
    header('location:../index.php?m=admin');
?>
```

在 `phpcms/modules/admin/` 文件夹里新建一个文件 `MY_index.php`，内容为：

```php
<?php 
    defined('IN_PHPCMS') or exit('No permission resources.');
    class MY_index extends index {
        public function __construct() {
            if(empty($_SESSION['right_enter'])) {
                header('location:./');
                exit;
            }
            parent::__construct();
        }
        public function public_logout() {
            $_SESSION['right_enter'] = 0;
            parent::public_logout();
        }
    }
?>
```

以后就只能通过 `my_web/` 目录访问后台登录入口 了，如果直接使用 index.php?m=admin 访问的话，会直接跳转到网站首页，这样就阻止了对后台登录入口的直接访问了。

## 系统常量在`phpcms\languages\` 下面，分中英文

当前位置：
```php
{catpos($catid)} {$title}
```

## 上一篇/下一篇

上一篇：

```php
<a href="{$previous_page[url]}">{str_cut($previous_page[title], 30)}</a>
```

下一篇：

```php
<a href="{$next_page[url]}">{str_cut($next_page[title], 30)}</a>
```

