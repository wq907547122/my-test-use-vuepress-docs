# 详细的设计模式
## 1.单例模式（Singleton）
在有些系统中，为了节省内存资源、保证数据内容的一致性，对某些类要求只能创建一个实例，这就是所谓的单例模式。
### 单例模式的定义与特点
单例（Singleton）模式的定义：指一个类只有一个实例，且该类能自行创建这个实例的一种模式。例如，Windows 中只能打开一个任务管理器，这样可以避免因打开多个任务管理器窗口而造成内存资源的浪费，或出现各个窗口显示内容的不一致等错误。
<br/>
在计算机系统中，还有 Windows 的回收站、操作系统中的文件系统、多线程中的线程池、显卡的驱动程序对象、打印机的后台处理服务、应用程序的日志对象、数据库的连接池、网站的计数器、Web 应用的配置对象、应用程序中的对话框、系统中的缓存等常常被设计成单例。
<br/>
单例模式有 3 个特点：
- 1.单例类只有一个实例对象；
- 2.该单例对象必须由单例类自行创建；
- 3.单例类对外提供一个访问该单例的全局访问点；
### 单例模式的结构与实现
单例模式是设计模式中最简单的模式之一。通常，普通类的构造函数是公有的，外部类可以通过“new 构造函数()”来生成多个实例。但是，如果将类的构造函数设为私有的，外部类就无法调用该构造函数，也就无法生成多个实例。这时该类自身必须定义一个静态私有实例，并向外提供一个静态的公有函数用于创建或获取该静态私有实例。

#### 1. 单例模式的结构
单例模式的主要角色如下。
- 单例类：包含一个实例且能自行创建这个实例的类。
- 访问类：使用单例的类。
<br/>
![](/images/design/9.gif)
<br/>
图1 单例模式的结构图
#### 2. 单例模式的实现
Singleton 模式通常有两种实现形式。
##### 第 1 种：懒汉式单例
该模式的特点是类加载时没有生成单例，只有当第一次调用 getlnstance 方法时才去创建这个单例。代码如下：
```java
public class LazySingleton
{
    private static volatile LazySingleton instance=null;    //保证 instance 在所有线程中同步
    private LazySingleton(){}    //private 避免类在外部被实例化
    public static synchronized LazySingleton getInstance()
    {
        //getInstance 方法前加同步
        if(instance==null)
        {
            instance=new LazySingleton();
        }
        return instance;
    }
}
```
注意：如果编写的是多线程程序，则不要删除上例代码中的关键字 volatile 和 synchronized，否则将存在线程非安全的问题。如果不删除这两个关键字就能保证线程安全，但是每次访问时都要同步，会影响性能，且消耗更多的资源，这是懒汉式单例的缺点。
##### 第 2 种：饿汉式单例
该模式的特点是类一旦加载就创建一个单例，保证在调用 getInstance 方法之前单例已经存在了。
```java
public class HungrySingleton
{
    private static final HungrySingleton instance=new HungrySingleton();
    private HungrySingleton(){}
    public static HungrySingleton getInstance()
    {
        return instance;
    }
}
```
饿汉式单例在类创建的同时就已经创建好一个静态的对象供系统使用，以后不再改变，所以是线程安全的，可以直接用于多线程而不会出现问题。
### 单例模式的应用实例
#### 用懒汉式单例模式模拟产生美国当今总统对象。
分析：在每一届任期内，美国的总统只有一人，所以本实例适合用单例模式实现，图 2 所示是用懒汉式单例实现的结构图。
<br/>
![](/images/design/10.gif)
<br/>
图2 美国总统生成器的结构图
<br/>
```java
public class SingletonLazy
{
    public static void main(String[] args)
    {
        President zt1=President.getInstance();
        zt1.getName();    //输出总统的名字
        President zt2=President.getInstance();
        zt2.getName();    //输出总统的名字
        if(zt1==zt2)
        {
           System.out.println("他们是同一人！");
        }
        else
        {
           System.out.println("他们不是同一人！");
        }
    }
}
class President
{
    private static volatile President instance=null;    //保证instance在所有线程中同步
    //private避免类在外部被实例化
    private President()
    {
        System.out.println("产生一个总统！");
    }
    public static synchronized President getInstance()
    {
        //在getInstance方法上加同步
        if(instance==null)
        {
               instance=new President();
        }
        else
        {
           System.out.println("已经有一个总统，不能产生新总统！");
        }
        return instance;
    }
    public void getName()
    {
        System.out.println("我是美国总统：特朗普。");
    }  
}
```
程序运行结果如下：
```info
产生一个总统！
我是美国总统：特朗普。
已经有一个总统，不能产生新总统！
我是美国总统：特朗普。
他们是同一人！
```
#### 用饿汉式单例模式模拟产生猪八戒对象。
分析：同上例类似，猪八戒也只有一个，所以本实例同样适合用单例模式实现。本实例由于要显示猪八戒的图像（[点此下载该程序所要显示的猪八戒图片](/images/design/Bajie.jpg)），所以用到了框架窗体 JFrame 组件，这里的猪八戒类是单例类，可以将其定义成面板 JPanel 的子类，里面包含了标签，用于保存猪八戒的图像，客户窗体可以获得猪八戒对象，并显示它。图 3 所示是用饿汉式单例实现的结构图。
```java
import java.awt.*;
import javax.swing.*;
public class SingletonEager
{
    public static void main(String[] args)
    {
        JFrame jf=new JFrame("饿汉单例模式测试");
        jf.setLayout(new GridLayout(1,2));
        Container contentPane=jf.getContentPane();
        Bajie obj1=Bajie.getInstance();
        contentPane.add(obj1);    
        Bajie obj2=Bajie.getInstance(); 
        contentPane.add(obj2);
        if(obj1==obj2)
        {
            System.out.println("他们是同一人！");
        }
        else
        {
            System.out.println("他们不是同一人！");
        }   
        jf.pack();       
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
}
class Bajie extends JPanel
{
    private static Bajie instance=new Bajie();
    private Bajie()
    { 
        JLabel l1=new JLabel(new ImageIcon("src/Bajie.jpg"));
        this.add(l1);   
    }
    public static Bajie getInstance()
    {
        return instance;
    }
}
```

### 单例模式的应用场景
前面分析了单例模式的结构与特点，以下是它通常适用的场景的特点。
- 在应用场景中，某类只要求生成一个对象的时候，如一个班中的班长、每个人的身份证号等。
- 当对象需要被共享的场合。由于单例模式只允许创建一个对象，共享该对象可以节省内存，并加快对象访问速度。如 Web 中的配置对象、数据库的连接池等。
- 当某类需要频繁实例化，而创建的对象又频繁被销毁的时候，如多线程的线程池、网络连接池等。
#### 单例模式的扩展
单例模式可扩展为有限的多例（Multitcm）模式，这种模式可生成有限个实例并保存在 ArrayList 中，客户需要时可随机获取，其结构图如图 5 所示。
<br/>
![](/images/design/12.gif)
<br/>


## 2.原型模式(Prototype)
:::tip 说明
原型模式在java中主要是使用clone()方法复制，就是复制对象
<br/>
克隆：浅克隆和深克隆
:::
在有些系统中，存在大量相同或相似对象的创建问题，如果用传统的构造函数来创建对象，会比较复杂且耗时耗资源，用原型模式生成对象就很高效，就像孙悟空拔下猴毛轻轻一吹就变出很多孙悟空一样简单。
### 原型模式的定义与特点
原型（Prototype）模式的定义如下：用一个已经创建的实例作为原型，通过复制该原型对象来创建一个和原型相同或相似的新对象。在这里，原型实例指定了要创建的对象的种类。用这种方式创建对象非常高效，根本无须知道对象创建的细节。例如，Windows 操作系统的安装通常较耗时，如果复制就快了很多。在生活中复制的例子非常多，这里不一一列举了。
### 原型模式的结构与实现
由于 Java 提供了对象的 clone() 方法，所以用 Java 实现原型模式很简单。
#### 1. 模式的结构
原型模式包含以下主要角色。
- 1.抽象原型类：规定了具体原型对象必须实现的接口。
- 2.具体原型类：实现抽象原型类的 clone() 方法，它是可被复制的对象。
- 3.访问类：使用具体原型类中的 clone() 方法来复制新的对象。
<br/>
![](/images/design/13.gif)
<br/>
#### 2. 模式的实现
原型模式的克隆分为浅克隆和深克隆，Java 中的 Object 类提供了浅克隆的 clone() 方法，具体原型类只要实现 Cloneable 接口就可实现对象的浅克隆，这里的 Cloneable 接口就是抽象原型类。其代码如下：
```java
//具体原型类
class Realizetype implements Cloneable
{
    Realizetype()
    {
        System.out.println("具体原型创建成功！");
    }
    public Object clone() throws CloneNotSupportedException
    {
        System.out.println("具体原型复制成功！");
        return (Realizetype)super.clone();
    }
}
//原型模式的测试类
public class PrototypeTest
{
    public static void main(String[] args)throws CloneNotSupportedException
    {
        Realizetype obj1=new Realizetype();
        Realizetype obj2=(Realizetype)obj1.clone();
        System.out.println("obj1==obj2?"+(obj1==obj2));
    }
}
```
运行结果：
```info
具体原型创建成功！
具体原型复制成功！
obj1==obj2?false
```
### 原型模式的应用实例
#### 1.用原型模式模拟“孙悟空”复制自己。
分析：孙悟空拔下猴毛轻轻一吹就变出很多孙悟空，这实际上是用到了原型模式。这里的孙悟空类 SunWukong 是具体原型类，而 Java 中的 Cloneable 接口是抽象原型类。
<br/>
同前面介绍的猪八戒实例一样，由于要显示孙悟空的图像（[点击此处下载该程序所要显示的孙悟空的图片](/images/design/Wukong.jpg)），所以将孙悟空类定义成面板 JPanel 的子类，里面包含了标签，用于保存孙悟空的图像。
<br/>
另外，重写了 Cloneable 接口的 clone() 方法，用于复制新的孙悟空。访问类可以通过调用孙悟空的 clone() 方法复制多个孙悟空，并在框架窗体 JFrame 中显示。图 2 所示是其结构图。
```java
import java.awt.*;
import javax.swing.*;
class SunWukong extends JPanel implements Cloneable
{
    private static final long serialVersionUID = 5543049531872119328L;
    public SunWukong()
    {
        JLabel l1=new JLabel(new ImageIcon("src/Wukong.jpg"));
        this.add(l1);   
    }
    public Object clone()
    {
        SunWukong w=null;
        try
        {
            w=(SunWukong)super.clone();
        }
        catch(CloneNotSupportedException e)
        {
            System.out.println("拷贝悟空失败!");
        }
        return w;
    }
}
public class ProtoTypeWukong
{
    public static void main(String[] args)
    {
        JFrame jf=new JFrame("原型模式测试");
        jf.setLayout(new GridLayout(1,2));
        Container contentPane=jf.getContentPane();
        SunWukong obj1=new SunWukong();
        contentPane.add(obj1);       
        SunWukong obj2=(SunWukong)obj1.clone();
        contentPane.add(obj2);   
        jf.pack();       
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);   
    }
}
```
运行结果:
<br/>
![](/images/design/14.gif)
<br/>
<br/>
用原型模式除了可以生成相同的对象，还可以生成相似的对象，请看以下实例。

#### 【例2】用原型模式生成“三好学生”奖状。
分析：同一学校的“三好学生”奖状除了获奖人姓名不同，其他都相同，属于相似对象的复制，同样可以用原型模式创建，然后再做简单修改就可以了。图 4 所示是三好学生奖状生成器的结构图。
<br/>
![](/images/design/15.gif)
<br/>
图4 奖状生成器的结构图
<br/>
```java
public class ProtoTypeCitation
{
    public static void main(String[] args) throws CloneNotSupportedException
    {
        citation obj1=new citation("张三","同学：在2016学年第一学期中表现优秀，被评为三好学生。","韶关学院");
        obj1.display();
        citation obj2=(citation) obj1.clone();
        obj2.setName("李四"); 
        obj2.display();
    }
}
//奖状类
class citation implements Cloneable
{
    String name;
    String info;
    String college;
    citation(String name,String info,String college)
    {
        this.name=name;
        this.info=info;
        this.college=college;
        System.out.println("奖状创建成功！");
    }
    void setName(String name)
    {
        this.name=name;
    }
    String getName()
    {
        return(this.name);
    }
    void display()
    {
        System.out.println(name+info+college);
    }
    public Object clone() throws CloneNotSupportedException
    {
        System.out.println("奖状拷贝成功！");
        return (citation)super.clone();
    }
}
```
程序运行结果如下：
```info
奖状创建成功！
张三同学：在2016学年第一学期中表现优秀，被评为三好学生。韶关学院
奖状拷贝成功！
李四同学：在2016学年第一学期中表现优秀，被评为三好学生。韶关学院
```

### 原型模式的应用场景
原型模式通常适用于以下场景。
- 1.对象之间相同或相似，即只是个别的几个属性不同的时候。
- 2.对象的创建过程比较麻烦，但复制比较简单的时候。

### 原型模式的扩展
原型模式可扩展为带原型管理器的原型模式，它在原型模式的基础上增加了一个原型管理器 PrototypeManager 类。该类用 HashMap 保存多个复制的原型，Client 类可以通过管理器的 get(String id) 方法从中获取复制的原型。其结构图如图 5 所示。
<br/>
![](/images/design/16.gif)
<br/>
图5 带原型管理器的原型模式的结构图
<br/>
#### 用例
##### 【例3】用带原型管理器的原型模式来生成包含“圆”和“正方形”等图形的原型，并计算其面积。分析：本实例中由于存在不同的图形类，例如，“圆”和“正方形”，它们计算面积的方法不一样，所以需要用一个原型管理器来管理它们，图 6 所示是其结构图。
![](/images/design/17.gif)
<br/>
图6 图形生成器的结构图
<br/>
```java
import java.util.*;
interface Shape extends Cloneable
{
    public Object clone();    //拷贝
    public void countArea();    //计算面积
}
class Circle implements Shape
{
    public Object clone()
    {
        Circle w=null;
        try
        {
            w=(Circle)super.clone();
        }
        catch(CloneNotSupportedException e)
        {
            System.out.println("拷贝圆失败!");
        }
        return w;
    }
    public void countArea()
    {
        int r=0;
        System.out.print("这是一个圆，请输入圆的半径：");
        Scanner input=new Scanner(System.in);
        r=input.nextInt();
        System.out.println("该圆的面积="+3.1415*r*r+"\n");
    }
}
class Square implements Shape
{
    public Object clone()
    {
        Square b=null;
        try
        {
            b=(Square)super.clone();
        }
        catch(CloneNotSupportedException e)
        {
            System.out.println("拷贝正方形失败!");
        }
        return b;
    }
    public void countArea()
    {
        int a=0;
        System.out.print("这是一个正方形，请输入它的边长：");
        Scanner input=new Scanner(System.in);
        a=input.nextInt();
        System.out.println("该正方形的面积="+a*a+"\n");
    }
}
class ProtoTypeManager
{
    private HashMap<String, Shape>ht=new HashMap<String,Shape>(); 
    public ProtoTypeManager()
    {
        ht.put("Circle",new Circle());
           ht.put("Square",new Square());
    } 
    public void addshape(String key,Shape obj)
    {
        ht.put(key,obj);
    }
    public Shape getShape(String key)
    {
        Shape temp=ht.get(key);
        return (Shape) temp.clone();
    }
}
public class ProtoTypeShape
{
    public static void main(String[] args)
    {
        ProtoTypeManager pm=new ProtoTypeManager();    
        Shape obj1=(Circle)pm.getShape("Circle");
        obj1.countArea();          
        Shape obj2=(Shape)pm.getShape("Square");
        obj2.countArea();     
    }
}
```
运行结果：
```info
这是一个圆，请输入圆的半径：3
该圆的面积=28.2735

这是一个正方形，请输入它的边长：3
该正方形的面积=9
```


## 3.工厂方法模式(FactoryMethod)
在现实生活中社会分工越来越细，越来越专业化。各种产品有专门的工厂生产，彻底告别了自给自足的小农经济时代，这大大缩短了产品的生产周期，提高了生产效率。同样，在软件开发中能否做到软件对象的生产和使用相分离呢？能否在满足“开闭原则”的前提下，客户随意增删或改变对软件相关对象的使用呢？这就是本节要讨论的问题。
### 模式的定义与特点
工厂方法（FactoryMethod）模式的定义：定义一个创建产品对象的工厂接口，将产品对象的实际创建工作推迟到具体子工厂类当中。这满足创建型模式中所要求的“创建与使用相分离”的特点。
<br/>
我们把被创建的对象称为“产品”，把创建产品的对象称为“工厂”。如果要创建的产品不多，只要一个工厂类就可以完成，这种模式叫“简单工厂模式”，它不属于 GoF 的 23 种经典设计模式，它的缺点是增加新产品时会违背“开闭原则”。
<br/>
本节介绍的“工厂方法模式”是对简单工厂模式的进一步抽象化，其好处是可以使系统在不修改原来代码的情况下引进新的产品，即满足开闭原则。
<br/>
工厂方法模式的主要优点有：
- 用户只需要知道具体工厂的名称就可得到所要的产品，无须知道产品的具体创建过程；
- 在系统增加新的产品时只需要添加具体产品类和对应的具体工厂类，无须对原工厂进行任何修改，满足开闭原则；
<br/>
其缺点是：每增加一个产品就要增加一个具体产品类和一个对应的具体工厂类，这增加了系统的复杂度。

### 模式的结构与实现
工厂方法模式由抽象工厂、具体工厂、抽象产品和具体产品等4个要素构成。本节来分析其基本结构和实现方法。
#### 1. 模式的结构
工厂方法模式的主要角色如下。
- 1.抽象工厂（Abstract Factory）：提供了创建产品的接口，调用者通过它访问具体工厂的工厂方法 newProduct() 来创建产品。
- 2.具体工厂（ConcreteFactory）：主要是实现抽象工厂中的抽象方法，完成具体产品的创建。
- 3.抽象产品（Product）：定义了产品的规范，描述了产品的主要特性和功能。
- 4.具体产品（ConcreteProduct）：实现了抽象产品角色所定义的接口，由具体工厂来创建，它同具体工厂之间一一对应。
<br/>
![](/images/design/18.gif)
<br/>
图1 工厂方法模式的结构图

#### 2. 模式的实现
```java
package FactoryMethod;
public class AbstractFactoryTest
{
    public static void main(String[] args)
    {
        try
        {
            Product a;
            AbstractFactory af;
            af=(AbstractFactory) ReadXML1.getObject();
            a=af.newProduct();
            a.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//抽象产品：提供了产品的接口
interface Product
{
    public void show();
}
//具体产品1：实现抽象产品中的抽象方法
class ConcreteProduct1 implements Product
{
    public void show()
    {
        System.out.println("具体产品1显示...");
    }
}
//具体产品2：实现抽象产品中的抽象方法
class ConcreteProduct2 implements Product
{
    public void show()
    {
        System.out.println("具体产品2显示...");
    }
}
//抽象工厂：提供了厂品的生成方法
interface AbstractFactory
{
    public Product newProduct();
}
//具体工厂1：实现了厂品的生成方法
class ConcreteFactory1 implements AbstractFactory
{
    public Product newProduct()
    {
        System.out.println("具体工厂1生成-->具体产品1...");
        return new ConcreteProduct1();
    }
}
//具体工厂2：实现了厂品的生成方法
class ConcreteFactory2 implements AbstractFactory
{
    public Product newProduct()
    {
        System.out.println("具体工厂2生成-->具体产品2...");
        return new ConcreteProduct2();
    }
}
```

```java
package FactoryMethod;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML1
{
    //该方法用于从XML配置文件中提取具体类类名，并返回一个实例对象
    public static Object getObject()
    {
        try
        {
            //创建文档对象
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/FactoryMethod/config1.xml"));        
            //获取包含类名的文本节点
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="FactoryMethod."+classNode.getNodeValue();
            //System.out.println("新类名："+cName);
            //通过类名生成实例对象并将其返回
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
         }  
         catch(Exception e)
         {
                   e.printStackTrace();
                   return null;
         }
    }
}
```
注意：该程序中用到了 XML 文件，如果想要获取该文件，请点击“[下载](http://c.biancheng.net/uploads/soft/181113/3-1Q114140222.zip)”，就可以对其进行下载。

### 模式的应用实例
#### 【例1】用工厂方法模式设计畜牧场。
分析：有很多种类的畜牧场，如养马场用于养马，养牛场用于养牛，所以该实例用工厂方法模式比较适合。
<br/>
对养马场和养牛场等具体工厂类，只要定义一个生成动物的方法 newAnimal() 即可。由于要显示马类和牛类等具体产品类的图像，所以它们的构造函数中用到了 JPanel、JLabd 和 ImageIcon 等组件，并定义一个 show() 方法来显示它们。
<br/>
客户端程序通过对象生成器类 ReadXML2 读取 XML 配置文件中的数据来决定养马还是养牛。其结构图如图 2 所示。
<br/>
![](/images/design/19.gif)
<br/>
注意：该程序中用到了 XML 文件，并且要显示马类和牛类等具体产品类的图像，如果想要获取 HTML 文件和图片，请点击“[下载](http://c.biancheng.net/uploads/soft/181113/3-1Q114140526.zip)”，就可以对其进行下载。
<br/>
```java
package FactoryMethod;
import java.awt.*;
import javax.swing.*;
public class AnimalFarmTest
{
    public static void main(String[] args)
    {
        try
        {
            Animal a;
            AnimalFarm af;
            af=(AnimalFarm) ReadXML2.getObject();
            a=af.newAnimal();
            a.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//抽象产品：动物类
interface Animal
{
    public void show();
}
//具体产品：马类
class Horse implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("工厂方法模式测试");
    public Horse()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：马"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Horse.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);    //用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//具体产品：牛类
class Cattle implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("工厂方法模式测试");
    public Cattle()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：牛"));
        sp=new JScrollPane(p1);
        contentPane.add(sp,BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Cattle.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);    //用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//抽象工厂：畜牧场
interface AnimalFarm
{
    public Animal newAnimal();
}
//具体工厂：养马场
class HorseFarm implements AnimalFarm
{
    public Animal newAnimal()
    {
        System.out.println("新马出生！");
        return new Horse();
    }
}
//具体工厂：养牛场
class CattleFarm implements AnimalFarm
{
    public Animal newAnimal()
    {
        System.out.println("新牛出生！");
        return new Cattle();
    }
}
```
```java
package FactoryMethod;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML2
{
    public static Object getObject()
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/FactoryMethod/config2.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="FactoryMethod."+classNode.getNodeValue();
            System.out.println("新类名："+cName);
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
        }  
        catch(Exception e)
        {
               e.printStackTrace();
               return null;
        }
    }
}
```

### 模式的应用场景
工厂方法模式通常适用于以下场景。
- 客户只知道创建产品的工厂名，而不知道具体的产品名。如 TCL 电视工厂、海信电视工厂等。
- 创建对象的任务由多个具体子工厂中的某一个完成，而抽象工厂只提供创建产品的接口。
- 客户不关心创建产品的细节，只关心产品的品牌。

## 4.抽象工厂模式
前面介绍的工厂方法模式中考虑的是一类产品的生产，如畜牧场只养动物、电视机厂只生产电视机、计算机软件学院只培养计算机软件专业的学生等。
<br/>
同种类称为同等级，也就是说：工厂方法模式只考虑生产同等级的产品，但是在现实生活中许多工厂是综合型的工厂，能生产多等级（种类） 的产品，如农场里既养动物又种植物，电器厂既生产电视机又生产洗衣机或空调，大学既有软件专业又有生物专业等。
<br/>
本节要介绍的抽象工厂模式将考虑多等级产品的生产，将同一个具体工厂所生产的位于不同等级的一组产品称为一个产品族，图 1 所示的是海尔工厂和 TCL 工厂所生产的电视机与空调对应的关系图。
<br/>
![](/images/design/20.gif)
### 模式的定义与特点
抽象工厂（AbstractFactory）模式的定义：是一种为访问类提供一个创建一组相关或相互依赖对象的接口，且访问类无须指定所要产品的具体类就能得到同族的不同等级的产品的模式结构。
<br/>
抽象工厂模式是工厂方法模式的升级版本，工厂方法模式只生产一个等级的产品，而抽象工厂模式可生产多个等级的产品。
<br/>
使用抽象工厂模式一般要满足以下条件。
- 系统中有多个产品族，每个具体工厂创建同一族但属于不同等级结构的产品。
- 系统一次只可能消费其中某一族产品，即同族的产品一起使用。
<br/>
抽象工厂模式除了具有工厂方法模式的优点外，其他主要优点如下。
- 可以在类的内部对产品族中相关联的多等级产品共同管理，而不必专门引入多个新的类来进行管理。
- 当增加一个新的产品族时不需要修改原代码，满足开闭原则。
<br/>
其缺点是：当产品族中需要增加一个新的产品时，所有的工厂类都需要进行修改。
### 模式的结构与实现
抽象工厂模式同工厂方法模式一样，也是由抽象工厂、具体工厂、抽象产品和具体产品等 4 个要素构成，但抽象工厂中方法个数不同，抽象产品的个数也不同。现在我们来分析其基本结构和实现方法。
<br/>
#### 1. 模式的结构
抽象工厂模式的主要角色如下。
- 1.抽象工厂（Abstract Factory）：提供了创建产品的接口，它包含多个创建产品的方法 newProduct()，可以创建多个不同等级的产品。
- 2.具体工厂（Concrete Factory）：主要是实现抽象工厂中的多个抽象方法，完成具体产品的创建。
- 3.抽象产品（Product）：定义了产品的规范，描述了产品的主要特性和功能，抽象工厂模式有多个抽象产品。
- 4.具体产品（ConcreteProduct）：实现了抽象产品角色所定义的接口，由具体工厂来创建，它 同具体工厂之间是多对一的关系。
<br/>
抽象工厂模式的结构图如图 2 所示。
<br/>
![](/images/design/21.gif)
#### 2. 模式的实现
从图 2 可以看出抽象工厂模式的结构同工厂方法模式的结构相似，不同的是其产品的种类不止一个，所以创建产品的方法也不止一个。下面给出抽象工厂和具体工厂的代码。
<br/>
(1) 抽象工厂：提供了产品的生成方法。
```java
interface AbstractFactory
{
    public Product1 newProduct1();
    public Product2 newProduct2();
}
```
(2) 具体工厂：实现了产品的生成方法。
class ConcreteFactory1 implements AbstractFactory
{
    public Product1 newProduct1()
    {
        System.out.println("具体工厂 1 生成-->具体产品 11...");
        return new ConcreteProduct11();
    }
    public Product2 newProduct2()
    {
        System.out.println("具体工厂 1 生成-->具体产品 21...");
        return new ConcreteProduct21();
    }
}

### 模式的应用实例
#### 【例1】用抽象工厂模式设计农场类。
分析：农场中除了像畜牧场一样可以养动物，还可以培养植物，如养马、养牛、种菜、种水果等，所以本实例比前面介绍的畜牧场类复杂，必须用抽象工厂模式来实现。
<br/>
本例用抽象工厂模式来设计两个农场，一个是韶关农场用于养牛和种菜，一个是上饶农场用于养马和种水果，可以在以上两个农场中定义一个生成动物的方法 newAnimal() 和一个培养植物的方法 newPlant()。
<br/>
对马类、牛类、蔬菜类和水果类等具体产品类，由于要显示它们的图像（[点此下载图片](http://c.biancheng.net/uploads/soft/181113/3-1Q114160J0.zip)），所以它们的构造函数中用到了 JPanel、JLabel 和 ImageIcon 等组件，并定义一个 show() 方法来显示它们。
<br/>
客户端程序通过对象生成器类 ReadXML 读取 XML 配置文件中的数据来决定养什么动物和培养什么植物（[点此下载 XML 文件](http://c.biancheng.net/uploads/soft/181113/3-1Q114160S7.zip)）。其结构图如图 3 所示。
<br/>
![](/images/design/22.gif)
<br/>
```java
package AbstractFactory;
import java.awt.*;
import javax.swing.*;
public class FarmTest
{
    public static void main(String[] args)
    {
        try
        {          
            Farm f;
            Animal a;
            Plant p;
            f=(Farm) ReadXML.getObject();
            a=f.newAnimal();
            p=f.newPlant();
            a.show();
            p.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//抽象产品：动物类
interface Animal
{
    public void show();
}
//具体产品：马类
class Horse implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Horse()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：马"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Horse.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//具体产品：牛类
class Cattle implements Animal
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Cattle() {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("动物：牛"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/A_Cattle.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//抽象产品：植物类
interface Plant
{
    public void show();
}
//具体产品：水果类
class Fruitage implements Plant
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Fruitage()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("植物：水果"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/P_Fruitage.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//具体产品：蔬菜类
class Vegetables implements Plant
{
    JScrollPane sp;
    JFrame jf=new JFrame("抽象工厂模式测试");
    public Vegetables()
    {
        Container contentPane=jf.getContentPane();
        JPanel p1=new JPanel();
        p1.setLayout(new GridLayout(1,1));
        p1.setBorder(BorderFactory.createTitledBorder("植物：蔬菜"));
        sp=new JScrollPane(p1);
        contentPane.add(sp, BorderLayout.CENTER);
        JLabel l1=new JLabel(new ImageIcon("src/P_Vegetables.jpg"));
        p1.add(l1);       
        jf.pack();       
        jf.setVisible(false);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);//用户点击窗口关闭 
    }
    public void show()
    {
        jf.setVisible(true);
    }
}
//抽象工厂：农场类
interface Farm
{
    public Animal newAnimal();
    public Plant newPlant();
}
//具体工厂：韶关农场类
class SGfarm implements Farm
{
    public Animal newAnimal()
    {
        System.out.println("新牛出生！");
        return new Cattle();
    }
    public Plant newPlant()
    {
        System.out.println("蔬菜长成！");
        return new Vegetables();
    }
}
//具体工厂：上饶农场类
class SRfarm implements Farm
{
    public Animal newAnimal()
    {
        System.out.println("新马出生！");
        return new Horse();
    }
    public Plant newPlant()
    {
        System.out.println("水果长成！");
        return new Fruitage();
    }
}
```


```java
package AbstractFactory;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML
{
    public static Object getObject()
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/AbstractFactory/config.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="AbstractFactory."+classNode.getNodeValue();
            System.out.println("新类名："+cName);
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
        }  
        catch(Exception e)
        {
               e.printStackTrace();
               return null;
        }
    }
}
```

### 模式的应用场景
抽象工厂模式最早的应用是用于创建属于不同操作系统的视窗构件。如 java 的 AWT 中的 Button 和 Text 等构件在 Windows 和 UNIX 中的本地实现是不同的。
<br/>
抽象工厂模式通常适用于以下场景：
- 当需要创建的对象是一系列相互关联或相互依赖的产品族时，如电器工厂中的电视机、洗衣机、空调等。
- 系统中有多个产品族，但每次只使用其中的某一族产品。如有人只喜欢穿某一个品牌的衣服和鞋。
- 系统中提供了产品的类库，且所有产品的接口相同，客户端不依赖产品实例的创建细节和内部结构。

### 模式的扩展
抽象工厂模式的扩展有一定的“开闭原则”倾斜性：
- 当增加一个新的产品族时只需增加一个新的具体工厂，不需要修改原代码，满足开闭原则。
- 当产品族中需要增加一个新种类的产品时，则所有的工厂类都需要进行修改，不满足开闭原则。
<br/>
另一方面，当系统中只存在一个等级结构的产品时，抽象工厂模式将退化到工厂方法模式。




## 5.建造者模式（Bulider模式）详解
在软件开发过程中有时需要创建一个复杂的对象，这个复杂对象通常由多个子部件按一定的步骤组合而成。例如，计算机是由 CPU、主板、内存、硬盘、显卡、机箱、显示器、键盘、鼠标等部件组装而成的，采购员不可能自己去组装计算机，而是将计算机的配置要求告诉计算机销售公司，计算机销售公司安排技术人员去组装计算机，然后再交给要买计算机的采购员。
<br/>
生活中这样的例子很多，如游戏中的不同角色，其性别、个性、能力、脸型、体型、服装、发型等特性都有所差异；还有汽车中的方向盘、发动机、车架、轮胎等部件也多种多样；每封电子邮件的发件人、收件人、主题、内容、附件等内容也各不相同。
<br/>
以上所有这些产品都是由多个部件构成的，各个部件可以灵活选择，但其创建步骤都大同小异。这类产品的创建无法用前面介绍的工厂模式描述，只有建造者模式可以很好地描述该类产品的创建。
### 模式的定义与特点
建造者（Builder）模式的定义：指将一个复杂对象的构造与它的表示分离，使同样的构建过程可以创建不同的表示，这样的设计模式被称为建造者模式。它是将一个复杂的对象分解为多个简单的对象，然后一步一步构建而成。它将变与不变相分离，即产品的组成部分是不变的，但每一部分是可以灵活选择的。
<br/>
该模式的主要优点如下：
- 1.各个具体的建造者相互独立，有利于系统的扩展。
- 2.客户端不必知道产品内部组成的细节，便于控制细节风险。
<br/>
其缺点如下：
- 1.产品的组成部分必须相同，这限制了其使用范围。
- 2.如果产品的内部变化复杂，该模式会增加很多的建造者类。
<br/>
建造者（Builder）模式和工厂模式的关注点不同：建造者模式注重零部件的组装过程，而工厂方法模式更注重零部件的创建过程，但两者可以结合使用。

### 模式的结构与实现
建造者（Builder）模式由产品、抽象建造者、具体建造者、指挥者等 4 个要素构成，现在我们来分析其基本结构和实现方法。

#### 1. 模式的结构
建造者（Builder）模式的主要角色如下。
- 1.产品角色（Product）：它是包含多个组成部件的复杂对象，由具体建造者来创建其各个滅部件。
- 2.抽象建造者（Builder）：它是一个包含创建产品各个子部件的抽象方法的接口，通常还包含一个返回复杂产品的方法 getResult()。
- 3.具体建造者(Concrete Builder）：实现 Builder 接口，完成复杂产品的各个部件的具体创建方法。
- 4.指挥者（Director）：它调用建造者对象中的部件构造与装配方法完成复杂对象的创建，在指挥者中不涉及具体产品的信息。
<br/>
![](/images/design/23.gif)
<br/>

#### 2. 模式的实现
(1) 产品角色：包含多个组成部件的复杂对象。
```java
class Product
{
    private String partA;
    private String partB;
    private String partC;
    public void setPartA(String partA)
    {
        this.partA=partA;
    }
    public void setPartB(String partB)
    {
        this.partB=partB;
    }
    public void setPartC(String partC)
    {
        this.partC=partC;
    }
    public void show()
    {
        //显示产品的特性
    }
}
```
(2) 抽象建造者：包含创建产品各个子部件的抽象方法。
```java
abstract class Builder
{
    //创建产品对象
    protected Product product=new Product();
    public abstract void buildPartA();
    public abstract void buildPartB();
    public abstract void buildPartC();
    //返回产品对象
    public Product getResult()
    {
        return product;
    }
}
```
(3) 具体建造者：实现了抽象建造者接口。
```java
public class ConcreteBuilder extends Builder
{
    public void buildPartA()
    {
        product.setPartA("建造 PartA");
    }
    public void buildPartB()
    {
        product.setPartA("建造 PartB");
    }
    public void buildPartC()
    {
        product.setPartA("建造 PartC");
    }
}
```
(4) 指挥者：调用建造者中的方法完成复杂对象的创建。
```java
class Director
{
    private Builder builder;
    public Director(Builder builder)
    {
        this.builder=builder;
    }
    //产品构建与组装方法
    public Product construct()
    {
        builder.buildPartA();
        builder.buildPartB();
        builder.buildPartC();
        return builder.getResult();
    }
}
```
(5) 客户类
```java
public class Client
{
    public static void main(String[] args)
    {
        Builder builder=new ConcreteBuilder();
        Director director=new Director(builder);
        Product product=director.construct();
        product.show();
    }
}
```

### 模式的应用实例
#### 【例1】用建造者（Builder）模式描述客厅装修。
分析：客厅装修是一个复杂的过程，它包含墙体的装修、电视机的选择、沙发的购买与布局等。客户把装修要求告诉项目经理，项目经理指挥装修工人一步步装修，最后完成整个客厅的装修与布局，所以本实例用建造者模式实现比较适合。
<br/>
这里客厅是产品，包括墙、电视和沙发等组成部分。具体装修工人是具体建造者，他们负责装修与墙、电视和沙发的布局。项目经理是指挥者，他负责指挥装修工人进行装修。
<br/>
另外，客厅类中提供了 show() 方法，可以将装修效果图显示出来（[点此下载装修效果图的图片](/images/design/25.png)）。客户端程序通过对象生成器类 ReadXML 读取 XML 配置文件中的装修方案数据（点此下载 XML 文件），调用项目经理进行装修。其类图如图 2 所示。
<br/>
![](/images/design/24.gif)
```java
package Builder;
import java.awt.*;
import javax.swing.*;
public class ParlourDecorator
{
    public static void main(String[] args)
    {
        try
        {
            Decorator d;
            d=(Decorator) ReadXML.getObject();
            ProjectManager m=new ProjectManager(d);       
            Parlour p=m.decorate();
            p.show();
        }
        catch(Exception e)
        {
            System.out.println(e.getMessage());
        }
    }
}
//产品：客厅
class Parlour
{
    private String wall;    //墙
    private String TV;    //电视
    private String sofa;    //沙发  
    public void setWall(String wall)
    {
        this.wall=wall;
    }
    public void setTV(String TV)
    {
        this.TV=TV;
    }
    public void setSofa(String sofa)
    {
        this.sofa=sofa;
    }   
    public void show()
    {
        JFrame jf=new JFrame("建造者模式测试");
        Container contentPane=jf.getContentPane();
        JPanel p=new JPanel();   
        JScrollPane sp=new JScrollPane(p);  
        String parlour=wall+TV+sofa;
        JLabel l=new JLabel(new ImageIcon("src/"+parlour+".png"));
        p.setLayout(new GridLayout(1,1));
        p.setBorder(BorderFactory.createTitledBorder("客厅"));
        p.add(l);
        contentPane.add(sp,BorderLayout.CENTER);       
        jf.pack();  
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }   
}
//抽象建造者：装修工人
abstract class Decorator
{
    //创建产品对象
    protected  Parlour product=new Parlour();
    public  abstract void buildWall();
    public  abstract void buildTV();
    public  abstract void buildSofa();
    //返回产品对象
    public  Parlour getResult()
    {
        return  product;
    }
}
//具体建造者：具体装修工人1
class ConcreteDecorator1  extends Decorator
{
    public void buildWall()
    {
        product.setWall("w1");
    }
    public void buildTV()
    {
        product.setTV("TV1");
    }
    public void buildSofa()
    {
        product.setSofa("sf1");
    }
}
//具体建造者：具体装修工人2
class ConcreteDecorator2 extends Decorator
{
    public void buildWall()
    {
        product.setWall("w2");
      }
      public void buildTV()
      {
          product.setTV("TV2");
      }
      public void buildSofa()
      {
          product.setSofa("sf2");
      }
}
//指挥者：项目经理
class ProjectManager
{
    private Decorator builder;
    public ProjectManager(Decorator builder)
    {
          this.builder=builder;
    }
    //产品构建与组装方法
    public Parlour decorate()
    {
          builder.buildWall();
        builder.buildTV();
        builder.buildSofa();
        return builder.getResult();
    }
}
```
```java
package Builder;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML
{
    public static Object getObject()
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/Builder/config.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="Builder."+classNode.getNodeValue();
            System.out.println("新类名："+cName);
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
         }  
         catch(Exception e)
         {
                   e.printStackTrace();
                   return null;
         }
    }
}
```
### 模式的应用场景
建造者（Builder）模式创建的是复杂对象，其产品的各个部分经常面临着剧烈的变化，但将它们组合在一起的算法却相对稳定，所以它通常在以下场合使用。
- 创建的对象较复杂，由多个部件构成，各部件面临着复杂的变化，但构件间的建造顺序是稳定的。
- 创建复杂对象的算法独立于该对象的组成部分以及它们的装配方式，即产品的构建过程和最终的表示是独立的。

### 模式的扩展
建造者（Builder）模式在应用过程中可以根据需要改变，如果创建的产品种类只有一种，只需要一个具体建造者，这时可以省略掉抽象建造者，甚至可以省略掉指挥者角色。

## 结构型模式概述（结构型模式的分类）
结构型模式描述如何将类或对象按某种布局组成更大的结构。它分为类结构型模式和对象结构型模式，前者采用继承机制来组织接口和类，后者釆用组合或聚合来组合对象。
<br/>
由于组合关系或聚合关系比继承关系耦合度低，满足“合成复用原则”，所以对象结构型模式比类结构型模式具有更大的灵活性。
<br/>
结构型模式分为以下 7 种：
- 1.代理（Proxy）模式：为某对象提供一种代理以控制对该对象的访问。即客户端通过代理间接地访问该对象，从而限制、增强或修改该对象的一些特性。
- 2.适配器（Adapter）模式：将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类能一起工作。
- 3.桥接（Bridge）模式：将抽象与实现分离，使它们可以独立变化。它是用组合关系代替继承关系来实现的，从而降低了抽象和实现这两个可变维度的耦合度。
- 4.装饰（Decorator）模式：动态地给对象增加一些职责，即增加其额外的功能。
- 5.外观（Facade）模式：为多个复杂的子系统提供一个一致的接口，使这些子系统更加容易被访问。
- 6.享元（Flyweight）模式：运用共享技术来有效地支持大量细粒度对象的复用。
- 7.组合（Composite）模式：将对象组合成树状层次结构，使用户对单个对象和组合对象具有一致的访问性。
## 6.代理模式（代理设计模式）详解
在有些情况下，一个客户不能或者不想直接访问另一个对象，这时需要找一个中介帮忙完成某项任务，这个中介就是代理对象。例如，购买火车票不一定要去火车站买，可以通过 12306 网站或者去火车票代售点买。又如找女朋友、找保姆、找工作等都可以通过找中介完成。
<br/>
在软件设计中，使用代理模式的例子也很多，例如，要访问的远程对象比较大（如视频或大图像等），其下载要花很多时间。还有因为安全原因需要屏蔽客户端直接访问真实对象，如某单位的内部数据库等。
<br/>
### 代理模式的定义与特点
代理模式的定义：由于某些原因需要给某对象提供一个代理以控制对该对象的访问。这时，访问对象不适合或者不能直接引用目标对象，代理对象作为访问对象和目标对象之间的中介。
<br/>
代理模式的主要优点有：
- 代理模式在客户端与目标对象之间起到一个中介作用和保护目标对象的作用；
- 代理对象可以扩展目标对象的功能；
- 代理模式能将客户端与目标对象分离，在一定程度上降低了系统的耦合度；
<br/>
其主要缺点是：
- 在客户端和目标对象之间增加一个代理对象，会造成请求处理速度变慢；
- 增加了系统的复杂度；
### 代理模式的结构与实现
代理模式的结构比较简单，主要是通过定义一个继承抽象主题的代理来包含真实主题，从而实现对真实主题的访问，下面来分析其基本结构和实现方法。
<br/>
#### 1. 模式的结构
代理模式的主要角色如下。
- 1.抽象主题（Subject）类：通过接口或抽象类声明真实主题和代理对象实现的业务方法。
- 2.真实主题（Real Subject）类：实现了抽象主题中的具体业务，是代理对象所代表的真实对象，是最终要引用的对象。
- 3.代理（Proxy）类：提供了与真实主题相同的接口，其内部含有对真实主题的引用，它可以访问、控制或扩展真实主题的功能。
<br/>
![](/images/design/25.gif)
<br/>
图1 代理模式的结构图
#### 2. 模式的实现
```java
package proxy;
public class ProxyTest
{
    public static void main(String[] args)
    {
        Proxy proxy=new Proxy();
        proxy.Request();
    }
}
//抽象主题
interface Subject
{
    void Request();
}
//真实主题
class RealSubject implements Subject
{
    public void Request()
    {
        System.out.println("访问真实主题方法...");
    }
}
//代理
class Proxy implements Subject
{
    private RealSubject realSubject;
    public void Request()
    {
        if (realSubject==null)
        {
            realSubject=new RealSubject();
        }
        preRequest();
        realSubject.Request();
        postRequest();
    }
    public void preRequest()
    {
        System.out.println("访问真实主题之前的预处理。");
    }
    public void postRequest()
    {
        System.out.println("访问真实主题之后的后续处理。");
    }
}
```
```info
程序运行的结果如下：
访问真实主题之前的预处理。
访问真实主题方法...
访问真实主题之后的后续处理。
```
### 代理模式的应用实例
#### 【例1】韶关“天街e角”公司是一家婺源特产公司的代理公司，用代理模式实现。
分析：本实例中的“婺源特产公司”经营许多婺源特产，它是真实主题，提供了显示特产的 display() 方法，可以用窗体程序实现（[点此下载该实例所要显示的图片](http://c.biancheng.net/uploads/soft/181113/3-1Q115111318.zip)）。而韶关“天街e角”公司是婺源特产公司特产的代理，通过调用婺源特产公司的 display() 方法显示代理产品，当然它可以增加一些额外的处理，如包裝或加价等。客户可通过“天街e角”代理公司间接访问“婺源特产公司”的产品，图 2 所示是公司的结构图。
<br/>
![](/images/desigin/26.gif)
<br/>
图2 韶关“天街e角”公司的结构图
```java
package proxy;
import java.awt.*;
import javax.swing.*;
public class WySpecialtyProxy
{
    public static void main(String[] args)
    {
        SgProxy proxy=new SgProxy();
        proxy.display();
    }
}
//抽象主题：特产
interface Specialty
{
    void display();
}
//真实主题：婺源特产
class WySpecialty extends JFrame implements Specialty
{
    private static final long serialVersionUID=1L;
    public WySpecialty()
    {
        super("韶关代理婺源特产测试");
        this.setLayout(new GridLayout(1,1));
        JLabel l1=new JLabel(new ImageIcon("src/proxy/WuyuanSpecialty.jpg"));
        this.add(l1);   
        this.pack();       
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);      
    }
    public void display()
    {
        this.setVisible(true);
    }
}
//代理：韶关代理
class SgProxy implements Specialty
{
    private WySpecialty realSubject=new WySpecialty();
    public void display()
    {
        preRequest();
        realSubject.display();
        postRequest();
    }
    public void preRequest()
    {
          System.out.println("韶关代理婺源特产开始。");
    }
    public void postRequest()
    {
          System.out.println("韶关代理婺源特产结束。");
    }
}
```

### 代理模式的应用场景
- 远程代理，这种方式通常是为了隐藏目标对象存在于不同地址空间的事实，方便客户端访问。例如，用户申请某些网盘空间时，会在用户的文件系统中建立一个虚拟的硬盘，用户访问虚拟硬盘时实际访问的是网盘空间。
- 虚拟代理，这种方式通常用于要创建的目标对象开销很大时。例如，下载一幅很大的图像需要很长时间，因某种计算比较复杂而短时间无法完成，这时可以先用小比例的虚拟代理替换真实的对象，消除用户对服务器慢的感觉。
- 安全代理，这种方式通常用于控制不同种类客户对真实对象的访问权限。
- 智能指引，主要用于调用目标对象时，代理附加一些额外的处理功能。例如，增加计算真实对象的引用次数的功能，这样当该对象没有被引用时，就可以自动释放它。
- 延迟加载，指为了提高系统的性能，延迟对目标的加载。例如，Hibernate 中就存在属性的延迟加载和关联表的延时加载。

### 代理模式的扩展
在前面介绍的代理模式中，代理类中包含了对真实主题的引用，这种方式存在两个缺点。
- 真实主题与代理主题一一对应，增加真实主题也要增加代理。
- 设计代理以前真实主题必须事先存在，不太灵活。采用动态代理模式可以解决以上问题，如 [Spring](http://c.biancheng.net/spring/)AOP，其结构图如图 4 所示。
<br/>
![](/images/design/27.gif)
<br/>
```java
package com.wu.qiang.proxy.dyna;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;

/**
 * @auth wq on 2019/12/9 10:19
 **/
public class Client {
    public static void main(String[] args) {
        // 代理的主题
        AbstractSubject subject = null;
        InvocationHandler handler = null;
        handler = new DynamicProxy(new RealSubject2());
        subject = (AbstractSubject) Proxy.newProxyInstance(AbstractSubject.class.getClassLoader(), new Class[]{AbstractSubject.class}, handler);
        subject.request();
    }
}

```
```java
package com.wu.qiang.proxy.dyna;

/**
 * 动态代理的接口
 * @auth wq on 2019/12/9 10:11
 **/
public interface AbstractSubject {
    void request();
}

```
```java
package com.wu.qiang.proxy.dyna;

/**
 * 真实主题1
 * @auth wq on 2019/12/9 10:12
 **/
public class RealSubject1 implements AbstractSubject {
    @Override
    public void request() {
        System.out.println("真实主题01，我的类型=RealSubject1");
    }
}

```
```java
package com.wu.qiang.proxy.dyna;

/**
* 真实的主题2
 * @auth wq on 2019/12/9 10:13
 **/
public class RealSubject2 implements AbstractSubject {
    @Override
    public void request() {
        System.out.println("真实主题02，我的类型=RealSubject2,不一样的风格呵呵");
    }
}

```

```java
package com.wu.qiang.proxy.dyna;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

/**
* 动态代理对象
 * @auth wq on 2019/12/9 10:17
 **/
public class DynamicProxy implements InvocationHandler {
    // 代理的对象
    private Object obj;
    public DynamicProxy(Object obj) {
        this.obj = obj;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        method.invoke(obj, args);
        return null;
    }
}

```
### [两种实现动态代理](https://www.cnblogs.com/socketqiang/p/11212029.html)
AOP的源码中用到了两种动态代理来实现拦截切入功能：jdk动态代理和cglib动态代理。两种方法同时存在，各有优劣。jdk动态代理是由java内部的反射机制来实现的，cglib动态代理底层则是借助asm来实现的。总的来说，反射机制在生成类的过程中比较高效，而asm在生成类之后的相关执行过程中比较高效（可以通过将asm生成的类进行缓存，这样解决asm生成类过程低效问题）。还有一点必须注意：jdk动态代理的应用前提，必须是目标类基于统一的接口。如果没有上述前提，jdk动态代理不能应用。由此可以看出，jdk动态代理有一定的局限性，cglib这种第三方类库实现的动态代理应用更加广泛，且在效率上更有优势。

#### jdk动态代理
```java
package com.xiaoqiang.design;
// 动态代理的接口
public interface Person {

      public void buy();

    public void buy1();
}
```
```java
package com.xiaoqiang.design;
// 动态代理的实现
public class xiaoQiang implements  Person {
    private String name;
    private String house;

    public xiaoQiang(String name, String house) {
        this.name = name;
        this.house = house;
    }

    @Override
    public void buy() {
        System.out.println(name+"买了"+house);
    }

    @Override
    public void buy1() {
        System.out.println("我是你爸爸");
    }
}
```
```java
package com.xiaoqiang.design;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
// 动态代理
public class ProxySaler implements InvocationHandler {

    public Person person;

    public Object newInstall(Person person)
    {
        this.person=person;
        return  Proxy.newProxyInstance(person.getClass().getClassLoader(),person.getClass().getInterfaces(),this);
    }
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("执行方法前的操作");
        if(method.getName().equals("buy")) {
            person.buy();
        }
        if(method.getName().equals("buy1"))
        {
            person.buy1();
        }
        System.out.println("执行方法后的操作");
        return null;
    }
}
```
```java
package com.xiaoqiang.design;

import sun.misc.ProxyGenerator;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
// JDK动态代理的测试
public class TestMain {

    public static void main(String[] args) {
        ProxySaler proxySaler=new ProxySaler();
        Person object= (Person) proxySaler.newInstall(new xiaoQiang("黄豪强","南山区"));
        object.buy1();
        object.buy();
    }
}
```
#### Cglib方法的动态代理
需要导入Cglib的jar包：
```pom
    <!-- https://mvnrepository.com/artifact/cglib/cglib -->
    <dependency>
        <groupId>cglib</groupId>
        <artifactId>cglib</artifactId>
        <version>3.2.12</version>
    </dependency>
```
1.定义被代理的方法:
```java
public class PlayGame {
    // 被代理的方法，不需要接口
    public void play()
    {
        System.out.println("打篮球很厉害");
    }
}
```
2.代理类
```java
import net.sf.cglib.proxy.Callback;
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

/**
 * @author 
 * @create 2019/7/24 8:51
 */
public class CglibProxy implements MethodInterceptor {

    public Object newInstall(Object object) {

        return Enhancer.create(object.getClass(), this);
    }


    public Object intercept(Object o, Method method, Object[] objects, MethodProxy methodProxy) throws Throwable {
        System.out.println("先热身一会");
        methodProxy.invokeSuper(o,objects);
        System.out.println("打完了");
        return null;
    }

}
```
3.运行类:测试gclib代理
```java
public class ProxyTeest {
    public static void main(String[] args) {
           CglibProxy cglibProxy=new CglibProxy();
            PlayGame playGame= (PlayGame) cglibProxy.newInstall(new PlayGame());
            playGame.play();
    }
}
```

## 7.适配器模式（Adapter模式）详解
在现实生活中，经常出现两个对象因接口不兼容而不能在一起工作的实例，这时需要第三者进行适配。例如，讲中文的人同讲英文的人对话时需要一个翻译，用直流电的笔记本电脑接交流电源时需要一个电源适配器，用计算机访问照相机的 SD 内存卡时需要一个读卡器等。
<br/>
在软件设计中也可能出现：需要开发的具有某种业务功能的组件在现有的组件库中已经存在，但它们与当前系统的接口规范不兼容，如果重新开发这些组件成本又很高，这时用适配器模式能很好地解决这些问题。
### 模式的定义与特点
适配器模式（Adapter）的定义如下：将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类能一起工作。适配器模式分为类结构型模式和对象结构型模式两种，前者类之间的耦合度比后者高，且要求程序员了解现有组件库中的相关组件的内部结构，所以应用相对较少些。
<br/>
该模式的主要优点如下。
- 客户端通过适配器可以透明地调用目标接口。
- 复用了现存的类，程序员不需要修改原有代码而重用现有的适配者类。
- 将目标类和适配者类解耦，解决了目标类和适配者类接口不一致的问题。
<br/>
其缺点是：对类适配器来说，更换适配器的实现过程比较复杂。

### 模式的结构与实现
类适配器模式可采用多重继承方式实现，如 [C++](http://c.biancheng.net/cplus/) 可定义一个适配器类来同时继承当前系统的业务接口和现有组件库中已经存在的组件接口；[Java](http://c.biancheng.net/java/) 不支持多继承，但可以定义一个适配器类来实现当前系统的业务接口，同时又继承现有组件库中已经存在的组件。
<br/>
对象适配器模式可釆用将现有组件库中已经实现的组件引入适配器类中，该类同时实现当前系统的业务接口。现在来介绍它们的基本结构。
#### 1. 模式的结构
适配器模式（Adapter）包含以下主要角色。
- 1.目标（Target）接口：当前系统业务所期待的接口，它可以是抽象类或接口。
- 2.适配者（Adaptee）类：它是被访问和适配的现存组件库中的组件接口。
- 3.适配器（Adapter）类：它是一个转换器，通过继承或引用适配者的对象，把适配者接口转换成目标接口，让客户按目标接口的格式访问适配者。
<br/>
类适配器模式的结构图如图 1 所示。
<br/>
<div style="text-align: center;">
![](/images/design/28.gif)
<br/>
图1 类适配器模式的结构图
</div>
对象适配器模式的结构图如图 2 所示。
<br/>
<div style="text-align: center;">
![](/images/design/29.gif)
<br/>
图2 类适配器模式的结构图
</div>

#### 2. 模式的实现
(1) 类适配器模式的代码如下。
```java
package adapter;
//目标接口
interface Target
{
    public void request();
}
//适配者接口
class Adaptee
{
    public void specificRequest()
    {       
        System.out.println("适配者中的业务代码被调用！");
    }
}
//类适配器类
class ClassAdapter extends Adaptee implements Target
{
    public void request()
    {
        specificRequest();
    }
}
//客户端代码
public class ClassAdapterTest
{
    public static void main(String[] args)
    {
        System.out.println("类适配器模式测试：");
        Target target = new ClassAdapter();
        target.request();
    }
}
```
```info
程序的运行结果如下：
类适配器模式测试：
适配者中的业务代码被调用！
```

(2)对象适配器模式的代码如下。
```java
package adapter;
//对象适配器类
class ObjectAdapter implements Target
{
    private Adaptee adaptee;
    public ObjectAdapter(Adaptee adaptee)
    {
        this.adaptee=adaptee;
    }
    public void request()
    {
        adaptee.specificRequest();
    }
}
//客户端代码
public class ObjectAdapterTest
{
    public static void main(String[] args)
    {
        System.out.println("对象适配器模式测试：");
        Adaptee adaptee = new Adaptee();
        Target target = new ObjectAdapter(adaptee);
        target.request();
    }
}
```
说明：对象适配器模式中的“目标接口”和“适配者类”的代码同类适配器模式一样，只要修改适配器类和客户端的代码即可。
<br/>
```info
程序的运行结果如下：
对象适配器模式测试：
适配者中的业务代码被调用！
```
### 模式的应用实例
#### 【例1】用适配器模式（Adapter）模拟新能源汽车的发动机。
分析：新能源汽车的发动机有电能发动机（Electric Motor）和光能发动机（Optical Motor）等，各种发动机的驱动方法不同，例如，电能发动机的驱动方法 electricDrive() 是用电能驱动，而光能发动机的驱动方法 opticalDrive() 是用光能驱动，它们是适配器模式中被访问的适配者。
<br/>
客户端希望用统一的发动机驱动方法 drive() 访问这两种发动机，所以必须定义一个统一的目标接口 Motor，然后再定义电能适配器（Electric Adapter）和光能适配器（Optical Adapter）去适配这两种发动机。
<br/>
我们把客户端想访问的新能源发动机的适配器的名称放在 XML 配置文件中（[点此下载 XML 文件](http://c.biancheng.net/uploads/soft/181113/3-1Q115110A5.zip)），客户端可以通过对象生成器类 ReadXML 去读取。这样，客户端就可以通过 Motor 接口随便使用任意一种新能源发动机去驱动汽车，图 3 所示是其结构图。
<br/>
![](/images/design/30.gif)
<br/>
图3 发动机适配器的结构图
```java
package adapter;
//目标：发动机
interface Motor
{
    public void drive();
}
//适配者1：电能发动机
class ElectricMotor
{
    public void electricDrive()
    {
        System.out.println("电能发动机驱动汽车！");
    }
}
//适配者2：光能发动机
class OpticalMotor
{
    public void opticalDrive()
    {
        System.out.println("光能发动机驱动汽车！");
    }
}
//电能适配器
class ElectricAdapter implements Motor
{
    private ElectricMotor emotor;
    public ElectricAdapter()
    {
        emotor=new ElectricMotor();
    }
    public void drive()
    {
        emotor.electricDrive();
    }
}
//光能适配器
class OpticalAdapter implements Motor
{
    private OpticalMotor omotor;
    public OpticalAdapter()
    {
        omotor=new OpticalMotor();
    }
    public void drive()
    {
        omotor.opticalDrive();
    }
}
//客户端代码
public class MotorAdapterTest
{
    public static void main(String[] args)
    {
        System.out.println("适配器模式测试：");
        Motor motor=(Motor)ReadXML.getObject();
        motor.drive();
    }
}
```
```java
package adapter;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML
{
    public static Object getObject()
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/adapter/config.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=nl.item(0).getFirstChild();
            String cName="adapter."+classNode.getNodeValue();
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
         }  
         catch(Exception e)
         {
                   e.printStackTrace();
                   return null;
         }
    }
}
```
```info
程序的运行结果如下：
适配器模式测试：
电能发动机驱动汽车！
```
### 模式的应用场景
适配器模式（Adapter）通常适用于以下场景。
- 以前开发的系统存在满足新系统功能需求的类，但其接口同新系统的接口不一致。
- 使用第三方提供的组件，但组件接口定义和自己要求的接口定义不同。

### 模式的扩展
适配器模式（Adapter）可扩展为双向适配器模式，双向适配器类既可以把适配者接口转换成目标接口，也可以把目标接口转换成适配者接口，其结构图如图 4 所示。
<br/>
![](/images/design/31.gif)
<br/>
图4 双向适配器模式的结构图
```java
package adapter;
//目标接口
interface TwoWayTarget
{
    public void request();
}
//适配者接口
interface TwoWayAdaptee
{
    public void specificRequest();
}
//目标实现
class TargetRealize implements TwoWayTarget
{
    public void request()
    {       
        System.out.println("目标代码被调用！");
    }
}
//适配者实现
class AdapteeRealize implements TwoWayAdaptee
{
    public void specificRequest()
    {       
        System.out.println("适配者代码被调用！");
    }
}
//双向适配器
class TwoWayAdapter  implements TwoWayTarget,TwoWayAdaptee
{
    private TwoWayTarget target;
    private TwoWayAdaptee adaptee;
    public TwoWayAdapter(TwoWayTarget target)
    {
        this.target=target;
    }
    public TwoWayAdapter(TwoWayAdaptee adaptee)
    {
        this.adaptee=adaptee;
    }
    public void request()
    {
        adaptee.specificRequest();
    }
    public void specificRequest()
    {       
        target.request();
    }
}
//客户端代码
public class TwoWayAdapterTest
{
    public static void main(String[] args)
    {
        System.out.println("目标通过双向适配器访问适配者：");
        TwoWayAdaptee adaptee=new AdapteeRealize();
        TwoWayTarget target=new TwoWayAdapter(adaptee);
        target.request();
        System.out.println("-------------------");
        System.out.println("适配者通过双向适配器访问目标：");
        target=new TargetRealize();
        adaptee=new TwoWayAdapter(target);
        adaptee.specificRequest();
    }
}
```
```info
程序的运行结果如下：
目标通过双向适配器访问适配者：
适配者代码被调用！
-------------------
适配者通过双向适配器访问目标：
目标代码被调用！
```

## 8.桥接模式（Bridge模式）详解
在现实生活中，某些类具有两个或多个维度的变化，如图形既可按形状分，又可按颜色分。如何设计类似于 Photoshop 这样的软件，能画不同形状和不同颜色的图形呢？如果用继承方式，m 种形状和 n 种颜色的图形就有 m×n 种，不但对应的子类很多，而且扩展困难。
<br/>
当然，这样的例子还有很多，如不同颜色和字体的文字、不同品牌和功率的汽车、不同性别和职业的男女、支持不同平台和不同文件格式的媒体播放器等。如果用桥接模式就能很好地解决这些问题。
### 桥接模式的定义与特点
桥接（Bridge）模式的定义如下：将抽象与实现分离，使它们可以独立变化。它是用组合关系代替继承关系来实现，从而降低了抽象和实现这两个可变维度的耦合度。
<br/>
<br/>
桥接（Bridge）模式的优点是：
- 由于抽象与实现分离，所以扩展能力强；
- 其实现细节对客户透明。
<br/>
缺点是：由于聚合关系建立在抽象层，要求开发者针对抽象化进行设计与编程，这增加了系统的理解与设计难度。

### 桥接模式的结构与实现
可以将抽象化部分与实现化部分分开，取消二者的继承关系，改用组合关系。
#### 1. 模式的结构
桥接（Bridge）模式包含以下主要角色。
- 1.抽象化（Abstraction）角色：定义抽象类，并包含一个对实现化对象的引用。
- 2.扩展抽象化（Refined    Abstraction）角色：是抽象化角色的子类，实现父类中的业务方法，并通过组合关系调用实现化角色中的业务方法。
- 3.实现化（Implementor）角色：定义实现化角色的接口，供扩展抽象化角色调用。
- 4.具体实现化（Concrete Implementor）角色：给出实现化角色接口的具体实现。
<br/>
![](/images/design/32.gif)
<br/>
图1 桥接模式的结构图
<br/>

#### 2. 模式的实现







```java
package bridge;
public class BridgeTest
{
    public static void main(String[] args)
    {
        Implementor imple=new ConcreteImplementorA();
        Abstraction abs=new RefinedAbstraction(imple);
        abs.Operation();
    }
}
//实现化角色
interface Implementor
{
    public void OperationImpl();
}
//具体实现化角色
class ConcreteImplementorA implements Implementor
{
    public void OperationImpl()
    {
        System.out.println("具体实现化(Concrete Implementor)角色被访问" );
    }
}
//抽象化角色
abstract class Abstraction
{
   protected Implementor imple;
   protected Abstraction(Implementor imple)
   {
       this.imple=imple;
   }
   public abstract void Operation();   
}
//扩展抽象化角色
class RefinedAbstraction extends Abstraction
{
   protected RefinedAbstraction(Implementor imple)
   {
       super(imple);
   }
   public void Operation()
   {
       System.out.println("扩展抽象化(Refined Abstraction)角色被访问" );
       imple.OperationImpl();
   }
}
```
```info
程序的运行结果如下：
扩展抽象化(Refined Abstraction)角色被访问
具体实现化(Concrete Implementor)角色被访问
```

### 桥接模式的应用实例

#### 【例1】用桥接（Bridge）模式模拟女士皮包的选购。
分析：女士皮包有很多种，可以按用途分、按皮质分、按品牌分、按颜色分、按大小分等，存在多个维度的变化，所以采用桥接模式来实现女士皮包的选购比较合适。

<br/>
本实例按用途分可选钱包（Wallet）和挎包（HandBag），按颜色分可选黄色（Yellow）和红色（Red）。可以按两个维度定义为颜色类和包类。（[点此下载本实例所要显示的包的图片](http://c.biancheng.net/uploads/soft/181113/3-1Q115125U5.zip)）。
<br/>
客户类通过 ReadXML 类从 XML 配置文件中获取包信息（[此下载 XML 配置文件](http://c.biancheng.net/uploads/soft/181113/3-1Q115130045.zip)），并把选到的产品通过窗体显示出现，图 2 所示是其结构图。

```java
package bridge;
import java.awt.*;
import javax.swing.*;
public class BagManage
{
    public static void main(String[] args)
    {
        Color color;
        Bag bag;
        color=(Color)ReadXML.getObject("color");
        bag=(Bag)ReadXML.getObject("bag");
        bag.setColor(color);
        String name=bag.getName();
        show(name);
    }
    public static void show(String name)
    {
        JFrame jf=new JFrame("桥接模式测试");
        Container contentPane=jf.getContentPane();
        JPanel p=new JPanel();   
        JLabel l=new JLabel(new ImageIcon("src/bridge/"+name+".jpg"));
        p.setLayout(new GridLayout(1,1));
        p.setBorder(BorderFactory.createTitledBorder("女士皮包"));
        p.add(l);
        contentPane.add(p, BorderLayout.CENTER);
        jf.pack();  
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
}
//实现化角色：颜色
interface Color
{
    String getColor();
}
//具体实现化角色：黄色
class Yellow implements Color
{
    public String getColor()
    {
        return "yellow";
    }
}
//具体实现化角色：红色
class Red implements Color
{
    public String getColor()
    {
        return "red";
    }
}
//抽象化角色：包
abstract class Bag
{
    protected Color color;
    public void setColor(Color color)
    {
        this.color=color;
    }   
    public abstract String getName();
}
//扩展抽象化角色：挎包
class HandBag extends Bag
{
    public String getName()
    {
        return color.getColor()+"HandBag";
    }   
}
//扩展抽象化角色：钱包
class Wallet extends Bag
{
    public String getName()
    {
        return color.getColor()+"Wallet";
    }   
}

```
```java
package bridge;
import javax.xml.parsers.*;
import org.w3c.dom.*;
import java.io.*;
class ReadXML
{
    public static Object getObject(String args)
    {
        try
        {
            DocumentBuilderFactory dFactory=DocumentBuilderFactory.newInstance();
            DocumentBuilder builder=dFactory.newDocumentBuilder();
            Document doc;                           
            doc=builder.parse(new File("src/bridge/config.xml"));
            NodeList nl=doc.getElementsByTagName("className");
            Node classNode=null;
            if(args.equals("color"))
            {
                classNode=nl.item(0).getFirstChild();
            }
            else if(args.equals("bag"))
            {
                classNode=nl.item(1).getFirstChild();
            }          
            String cName="bridge."+classNode.getNodeValue();
            Class<?> c=Class.forName(cName);
              Object obj=c.newInstance();
            return obj;
        }  
        catch(Exception e)
        {
               e.printStackTrace();
               return null;
        }
    }
}
```

### 桥接模式的应用场景
桥接模式通常适用于以下场景。
- 1.当一个类存在两个独立变化的维度，且这两个维度都需要进行扩展时。
- 2.当一个系统不希望使用继承或因为多层次继承导致系统类的个数急剧增加时。
- 3.当一个系统需要在构件的抽象化角色和具体化角色之间增加更多的灵活性时。
### 桥接模式模式的扩展
在软件开发中，有时桥接（[Bridge](http://c.biancheng.net/view/1361.html)）模式可与适配器模式联合使用。当桥接（Bridge）模式的实现化角色的接口与现有类的接口不一致时，可以在二者中间定义一个适配器将二者连接起来，其具体结构图如图 5 所示
<br/>
![](/images/design/33.gif)
<br/>
图5 桥接模式与适配器模式联用的结构图

### 桥接和适配的组合
也以钱包位列： 
女士皮包: 本实例按用途分可选钱包（Wallet）和挎包（HandBag），按颜色分可选黄色（Yellow）和红色（Red）
我们可以定义钱包的用途，这里为了简单，我们的用途就作为的枚举(定义对应的类也可以只要提供获取对应用途的名称也可以)
<br/>
具体的代码：
```java
package com.wu.qiang.bridge.adapter;

/**
 * 适配的目标(target)
 * 桥接的抽象化()
 * @auth wq on 2019/12/9 14:53
 **/
public interface Color {
    String getColor();
}

```
```java
package com.wu.qiang.bridge.adapter;

/**
 * 红色
 * 桥接：扩展实现化
 * 适配：适配者
 * @auth wq on 2019/12/9 14:55
 **/
public class Red implements Color {
    @Override
    public String getColor() {
        return "red";
    }
}

```
```java
package com.wu.qiang.bridge.adapter;

/**
 * 黄色
 * 桥接：扩展实现化
 * 适配：适配者
 * @auth wq on 2019/12/9 14:57
 **/
public class Yellow implements Color {
    @Override
    public String getColor() {
        return "yellow";
    }
}

```
```java
package com.wu.qiang.bridge.adapter;

/**
 * 颜色适配器
 * @auth wq on 2019/12/9 15:31
 **/
public class ColorAdapter implements Color{
    private Color color;
    public ColorAdapter(Color color){
        this.color = color;
    }
    @Override
    public String getColor() {
        return color.getColor();
    }
}

```
```java
package com.wu.qiang.bridge.adapter;

/**
* 包的实现化：提供实现化的接口
 * @auth wq on 2019/12/9 15:11
 **/
public abstract class Bag {
    protected Color color;
    protected Bag(Color color) {
        this.color = color;
    }

    public abstract String getName();
}

```
```java
package com.wu.qiang.bridge.adapter;

/**
*  包的适配器.
*  在桥接模式中：具体实现化
 * @auth wq on 2019/12/9 15:34
 **/
public class BagAdapter extends Bag{
    private BagEnum name;
    public BagAdapter(Color color, BagEnum name) {
        super(color);
        this.name = name;
    }
    @Override
    public String getName() {
        return color.getColor() + name.toString();
    }
    // 包的用途分类
    public enum BagEnum{
        // 钱包
        Wallet,
        // 挎包
        HandBag
    }
}

```
测试：使用适配器模式和桥接模式的测试
```java{18-24}
package com.wu.qiang.bridge.adapter;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.GridLayout;

/**
 * @auth wq on 2019/12/9 15:18
 **/
public class BagManage {
    public static void main(String[] args) {
        // 适配模式：获取 适配器,颜色适配器，根据传递的颜色，确定具体调用那种颜色
        Color color = new ColorAdapter(new Red());
//        Bag bag = new HandBag(color);
        // 桥接模式： 获取  抽象化角色，并且使用这个适配器来创建对象或者做一个set方法，这里使用的是构造函数
        // Bag bag = new Wallet(color);
        Bag bag = new BagAdapter(color, BagAdapter.BagEnum.HandBag);
        // 使用桥接模式的 抽象化接口
        show(bag.getName());
    }
    public static void show(String name)
    {
        JFrame jf=new JFrame("桥接模式测试");
        Container contentPane=jf.getContentPane();
        JPanel p=new JPanel();
        JLabel l=new JLabel(new ImageIcon("src/main/resources/bridge/"+name+".jpg"));
        p.setLayout(new GridLayout(1,1));
        p.setBorder(BorderFactory.createTitledBorder("女士皮包"));
        p.add(l);
        contentPane.add(p, BorderLayout.CENTER);
        jf.pack();
        jf.setVisible(true);
        jf.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }


}
```


## 9.装饰模式（装饰设计模式）详解
在现实生活中，常常需要对现有产品增加新的功能或美化其外观，如房子装修、相片加相框等。在软件开发过程中，有时想用一些现存的组件。这些组件可能只是完成了一些核心功能。但在不改变其结构的情况下，可以动态地扩展其功能。所有这些都可以釆用装饰模式来实现。
### 装饰模式的定义与特点
装饰（Decorator）模式的定义：指在不改变现有对象结构的情况下，动态地给该对象增加一些职责（即增加其额外功能）的模式，它属于对象结构型模式。
<br/>
装饰（Decorator）模式的主要优点有：
- 采用装饰模式扩展对象的功能比采用继承方式更加灵活。
- 可以设计出多个不同的具体装饰类，创造出多个不同行为的组合。
<br/>
其主要缺点是：装饰模式增加了许多子类，如果过度使用会使程序变得很复杂。
### 装饰模式的结构与实现
通常情况下，扩展一个类的功能会使用继承方式来实现。但继承具有静态特征，耦合度高，并且随着扩展功能的增多，子类会很膨胀。如果使用组合关系来创建一个包装对象（即装饰对象）来包裹真实对象，并在保持真实对象的类结构不变的前提下，为其提供额外的功能，这就是装饰模式的目标。下面来分析其基本结构和实现方法。

#### 1. 模式的结构
装饰模式主要包含以下角色。
- 抽象构件（Component）角色：定义一个抽象接口以规范准备接收附加责任的对象。
- 具体构件（Concrete    Component）角色：实现抽象构件，通过装饰角色为其添加一些职责。
- 抽象装饰（Decorator）角色：继承抽象构件，并包含具体构件的实例，可以通过其子类扩展具体构件的功能。
- 具体装饰（ConcreteDecorator）角色：实现抽象装饰的相关方法，并给具体构件对象添加附加的责任。
<br/>
![](/images/design/34.gif)
<br/>
#### 2. 模式的实现
```java
package decorator;
public class DecoratorPattern
{
    public static void main(String[] args)
    {
        Component p=new ConcreteComponent();
        p.operation();
        System.out.println("---------------------------------");
        Component d=new ConcreteDecorator(p);
        d.operation();
    }
}
//抽象构件角色
interface  Component
{
    public void operation();
}
//具体构件角色
class ConcreteComponent implements Component
{
    public ConcreteComponent()
    {
        System.out.println("创建具体构件角色");       
    }   
    public void operation()
    {
        System.out.println("调用具体构件角色的方法operation()");           
    }
}
//抽象装饰角色
class Decorator implements Component
{
    private Component component;   
    public Decorator(Component component)
    {
        this.component=component;
    }   
    public void operation()
    {
        component.operation();
    }
}
//具体装饰角色
class ConcreteDecorator extends Decorator
{
    public ConcreteDecorator(Component component)
    {
        super(component);
    }   
    public void operation()
    {
        super.operation();
        addedFunction();
    }
    public void addedFunction()
    {
        System.out.println("为具体构件角色增加额外的功能addedFunction()");           
    }
}
```

```info
程序运行结果如下：
创建具体构件角色
调用具体构件角色的方法operation()
---------------------------------
调用具体构件角色的方法operation()
为具体构件角色增加额外的功能addedFunction()
```

### 装饰模式的应用实例
#### 【例1】用装饰模式实现游戏角色“莫莉卡·安斯兰”的变身。
分析：在《恶魔战士》中，游戏角色“莫莉卡·安斯兰”的原身是一个可爱少女，但当她变身时，会变成头顶及背部延伸出蝙蝠状飞翼的女妖，当然她还可以变为穿着漂亮外衣的少女。这些都可用装饰模式来实现，在本实例中的“莫莉卡”原身有 setImage(String t) 方法决定其显示方式，而其 变身“蝙蝠状女妖”和“着装少女”可以用 setChanger() 方法来改变其外观，原身与变身后的效果用 display() 方法来显示（[点此下载其原身和变身后的图片](http://c.biancheng.net/uploads/soft/181113/3-1Q115142F6.zip)），图 2 所示是其结构图。
<br/>
![](/images/design/35.gif)
<br/>
```java
package decorator;
import java.awt.*;
import javax.swing.*;
public class MorriganAensland
{
    public static void main(String[] args)
    {
        Morrigan m0=new original();
        m0.display();
        Morrigan m1=new Succubus(m0);
        m1.display();
        Morrigan m2=new Girl(m0);
        m2.display();
    }
}
//抽象构件角色：莫莉卡
interface  Morrigan
{
    public void display();
}
//具体构件角色：原身
class original extends JFrame implements Morrigan
{
    private static final long serialVersionUID = 1L;
    private String t="Morrigan0.jpg";
    public original()
    {
        super("《恶魔战士》中的莫莉卡·安斯兰");                
    }
    public void setImage(String t)
    {
        this.t=t;           
    }
    public void display()
    {   
        this.setLayout(new FlowLayout());
        JLabel l1=new JLabel(new ImageIcon("src/decorator/"+t));
        this.add(l1);   
        this.pack();       
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);  
        this.setVisible(true);
    }
}
//抽象装饰角色：变形
class Changer implements Morrigan
{
    Morrigan m;   
    public Changer(Morrigan m)
    {
        this.m=m;
    }   
    public void display()
    {
        m.display();
    }
}
//具体装饰角色：女妖
class Succubus extends Changer
{
    public Succubus(Morrigan m)
    {
        super(m);
    }   
    public void display()
    {
        setChanger();
        super.display();   
    }
    public void setChanger()
    {
        ((original) super.m).setImage("Morrigan1.jpg");           
    }
}
//具体装饰角色：少女
class Girl extends Changer
{
    public Girl(Morrigan m)
    {
        super(m);
    }   
    public void display()
    {
        setChanger();
        super.display();   
    }
    public void setChanger()
    {
        ((original) super.m).setImage("Morrigan2.jpg");           
    }
}
```
### 装饰模式的应用场景
前面讲解了关于装饰模式的结构与特点，下面介绍其适用的应用场景，装饰模式通常在以下几种情况使用。
- 当需要给一个现有类添加附加职责，而又不能采用生成子类的方法进行扩充时。例如，该类被隐藏或者该类是终极类或者采用继承方式会产生大量的子类。
- 当需要通过对现有的一组基本功能进行排列组合而产生非常多的功能时，采用继承关系很难实现，而采用装饰模式却很好实现。
- 当对象的功能要求可以动态地添加，也可以再动态地撤销时。
<br/>
装饰模式在 [Java](http://c.biancheng.net/java/) 语言中的最著名的应用莫过于 Java I/O 标准库的设计了。例如，InputStream 的子类 FilterInputStream，OutputStream 的子类 FilterOutputStream，Reader 的子类 BufferedReader 以及 FilterReader，还有 Writer 的子类 BufferedWriter、FilterWriter 以及 PrintWriter 等，它们都是抽象装饰类。
<br/>
下面代码是为 FileReader 增加缓冲区而采用的装饰类 BufferedReader 的例子：
```test
BufferedReader in=new BufferedReader(new FileReader("filename.txtn));
String s=in.readLine();
```
### 装饰模式的扩展
饰模式所包含的 4 个角色不是任何时候都要存在的，在有些应用环境下模式是可以简化的，如以下两种情况。
<br/>
#### (1) 如果只有一个具体构件而没有抽象构件时，可以让抽象装饰继承具体构件，其结构图如图 4 所示。
![](/images/design/36.gif)
<br/>
#### (2) 如果只有一个具体装饰时，可以将抽象装饰和具体装饰合并，其结构图如图 5 所示
![](/images/design/37.gif)

## 10.外观模式（Facade模式）详解
在现实生活中，常常存在办事较复杂的例子，如办房产证或注册一家公司，有时要同多个部门联系，这时要是有一个综合部门能解决一切手续问题就好了。
<br/>
软件设计也是这样，当一个系统的功能越来越强，子系统会越来越多，客户对系统的访问也变得越来越复杂。这时如果系统内部发生改变，客户端也要跟着改变，这违背了“开闭原则”，也违背了“迪米特法则”，所以有必要为多个子系统提供一个统一的接口，从而降低系统的耦合度，这就是外观模式的目标。
<br/>
图 1 给出了客户去当地房产局办理房产证过户要遇到的相关部门。
<br/>
![](/images/design/38.gif)
### 外观模式的定义与特点
外观（Facade）模式的定义：是一种通过为多个复杂的子系统提供一个一致的接口，而使这些子系统更加容易被访问的模式。该模式对外有一个统一接口，外部应用程序不用关心内部子系统的具体的细节，这样会大大降低应用程序的复杂度，提高了程序的可维护性。
<br/>
外观（Facade）模式是“迪米特法则”的典型应用，它有以下主要优点。
- 1.降低了子系统与客户端之间的耦合度，使得子系统的变化不会影响调用它的客户类。
- 2.对客户屏蔽了子系统组件，减少了客户处理的对象数目，并使得子系统使用起来更加容易。
- 3.降低了大型软件系统中的编译依赖性，简化了系统在不同平台之间的移植过程，因为编译一个子系统不会影响其他的子系统，也不会影响外观对象。
<br/>
外观（Facade）模式的主要缺点如下。
- 1.不能很好地限制客户使用子系统类。
- 2.增加新的子系统可能需要修改外观类或客户端的源代码，违背了“开闭原则”。

### 外观模式的结构与实现
外观（Facade）模式的结构比较简单，主要是定义了一个高层接口。它包含了对各个子系统的引用，客户端可以通过它访问各个子系统的功能。现在来分析其基本结构和实现方法。
#### 1. 模式的结构
外观（Facade）模式包含以下主要角色。
- 1.外观（Facade）角色：为多个子系统对外提供一个共同的接口。
- 2.子系统（Sub System）角色：实现系统的部分功能，客户可以通过外观角色访问它。
- 3.客户（Client）角色：通过一个外观角色访问各个子系统的功能。
<br/>
![](/images/design/39.gif)

#### 2. 模式的实现
```java
package facade;
public class FacadePattern
{
    public static void main(String[] args)
    {
        Facade f=new Facade();
        f.method();
    }
}
//外观角色
class Facade
{
    private SubSystem01 obj1=new SubSystem01();
    private SubSystem02 obj2=new SubSystem02();
    private SubSystem03 obj3=new SubSystem03();
    public void method()
    {
        obj1.method1();
        obj2.method2();
        obj3.method3();
    }
}
//子系统角色
class SubSystem01
{
    public  void method1()
    {
        System.out.println("子系统01的method1()被调用！");
    }   
}
//子系统角色
class SubSystem02
{
    public  void method2()
    {
        System.out.println("子系统02的method2()被调用！");
    }   
}
//子系统角色
class SubSystem03
{
    public  void method3()
    {
        System.out.println("子系统03的method3()被调用！");
    }   
}
```

### 外观模式的应用实例
#### 【例1】用“外观模式”设计一个婺源特产的选购界面。
分析：本实例的外观角色 WySpecialty 是 JPanel 的子类，它拥有 8 个子系统角色 Specialty1~Specialty8，它们是图标类（ImageIcon）的子类对象，用来保存该婺源特产的图标（[点此下载要显示的婺源特产的图片](http://c.biancheng.net/uploads/soft/181113/3-1Q115152634.zip)）。
<br/>
外观类（WySpecialty）用 JTree 组件来管理婺源特产的名称，并定义一个事件处理方法 valueClianged(TreeSelectionEvent e)，当用户从树中选择特产时，该特产的图标对象保存在标签（JLabd）对象中。
<br/>
客户窗体对象用分割面板来实现，左边放外观角色的目录树，右边放显示所选特产图像的标签。其结构图如图 3 所示。
<br/>
![](/images/design/40.gif)
<br/>
```java
package facade;
import java.awt.*;
import javax.swing.*;
import javax.swing.event.*;
import javax.swing.tree.DefaultMutableTreeNode;
public class WySpecialtyFacade
{
    public static void main(String[] args)
    {
        JFrame f=new JFrame ("外观模式: 婺源特产选择测试");
        Container cp=f.getContentPane();       
        WySpecialty wys=new WySpecialty();       
        JScrollPane treeView=new JScrollPane(wys.tree);
        JScrollPane scrollpane=new JScrollPane(wys.label);       
        JSplitPane splitpane=new JSplitPane(JSplitPane.HORIZONTAL_SPLIT,true,treeView,scrollpane); //分割面版
        splitpane.setDividerLocation(230);     //设置splitpane的分隔线位置
        splitpane.setOneTouchExpandable(true); //设置splitpane可以展开或收起                       
        cp.add(splitpane);
        f.setSize(650,350);
        f.setVisible(true);   
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
}
class WySpecialty extends JPanel implements TreeSelectionListener
{
    private static final long serialVersionUID=1L;
    final JTree tree;
    JLabel label;
    private Specialty1 s1=new Specialty1();
    private Specialty2 s2=new Specialty2();
    private Specialty3 s3=new Specialty3();
    private Specialty4 s4=new Specialty4();
    private Specialty5 s5=new Specialty5();
    private Specialty6 s6=new Specialty6();
    private Specialty7 s7=new Specialty7();
    private Specialty8 s8=new Specialty8();
    WySpecialty(){       
        DefaultMutableTreeNode top=new DefaultMutableTreeNode("婺源特产");
        DefaultMutableTreeNode node1=null,node2=null,tempNode=null;       
        node1=new DefaultMutableTreeNode("婺源四大特产（红、绿、黑、白）");
        tempNode=new DefaultMutableTreeNode("婺源荷包红鲤鱼");
        node1.add(tempNode);
        tempNode=new DefaultMutableTreeNode("婺源绿茶");
        node1.add(tempNode);
        tempNode=new DefaultMutableTreeNode("婺源龙尾砚");
        node1.add(tempNode);
        tempNode=new DefaultMutableTreeNode("婺源江湾雪梨");
        node1.add(tempNode);
        top.add(node1);           
        node2=new DefaultMutableTreeNode("婺源其它土特产");
        tempNode=new DefaultMutableTreeNode("婺源酒糟鱼");
        node2.add(tempNode);
        tempNode=new DefaultMutableTreeNode("婺源糟米子糕");
        node2.add(tempNode);
        tempNode=new DefaultMutableTreeNode("婺源清明果");
        node2.add(tempNode);
        tempNode=new DefaultMutableTreeNode("婺源油煎灯");
        node2.add(tempNode);
        top.add(node2);           
        tree=new JTree(top);
        tree.addTreeSelectionListener(this);
        label=new JLabel();
    }   
    public void valueChanged(TreeSelectionEvent e)
    {
        if(e.getSource()==tree)
        {
            DefaultMutableTreeNode node=(DefaultMutableTreeNode) tree.getLastSelectedPathComponent();
            if(node==null) return;
            if(node.isLeaf())
            {
                Object object=node.getUserObject();
                String sele=object.toString();
                label.setText(sele);
                label.setHorizontalTextPosition(JLabel.CENTER);
                label.setVerticalTextPosition(JLabel.BOTTOM);
                sele=sele.substring(2,4);
                if(sele.equalsIgnoreCase("荷包")) label.setIcon(s1);
                else if(sele.equalsIgnoreCase("绿茶")) label.setIcon(s2);
                else if(sele.equalsIgnoreCase("龙尾")) label.setIcon(s3);
                else if(sele.equalsIgnoreCase("江湾")) label.setIcon(s4);
                else if(sele.equalsIgnoreCase("酒糟")) label.setIcon(s5);
                else if(sele.equalsIgnoreCase("糟米")) label.setIcon(s6);
                else if(sele.equalsIgnoreCase("清明")) label.setIcon(s7);
                else if(sele.equalsIgnoreCase("油煎")) label.setIcon(s8);
                label.setHorizontalAlignment(JLabel.CENTER);
            }
        }               
    }
}
class Specialty1 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty1()
    {
        super("src/facade/WyImage/Specialty11.jpg");
    }
}
class Specialty2 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty2()
    {
        super("src/facade/WyImage/Specialty12.jpg");
    }
}
class Specialty3 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty3()
    {
        super("src/facade/WyImage/Specialty13.jpg");
    }
}
class Specialty4 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty4()
    {
        super("src/facade/WyImage/Specialty14.jpg");
    }
}
class Specialty5 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty5()
    {
        super("src/facade/WyImage/Specialty21.jpg");
    }
}
class Specialty6 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty6()
    {
        super("src/facade/WyImage/Specialty22.jpg");
    }
}
class Specialty7 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty7()
    {
        super("src/facade/WyImage/Specialty23.jpg");
    }
}
class Specialty8 extends ImageIcon
{
    private static final long serialVersionUID=1L;
    Specialty8()
    {
        super("src/facade/WyImage/Specialty24.jpg");
    }
}
```

### 外观模式的应用场景
通常在以下情况下可以考虑使用外观模式。
- 对分层结构系统构建时，使用外观模式定义子系统中每层的入口点可以简化子系统之间的依赖关系。
- 当一个复杂系统的子系统很多时，外观模式可以为系统设计一个简单的接口供外界访问。
- 当客户端与多个子系统之间存在很大的联系时，引入外观模式可将它们分离，从而提高子系统的独立性和可移植性。

### 外观模式的扩展
在外观模式中，当增加或移除子系统时需要修改外观类，这违背了“开闭原则”。如果引入抽象外观类，则在一定程度上解决了该问题，其结构图如图 5 所示。
<br/>
![](/images/design/41.gif)
















