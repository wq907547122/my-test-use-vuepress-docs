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

## 11.享元模式（详解版）
在面向对象程序设计过程中，有时会面临要创建大量相同或相似对象实例的问题。创建那么多的对象将会耗费很多的系统资源，它是系统性能提高的一个瓶颈。例如，围棋和五子棋中的黑白棋子，图像中的坐标点或颜色，局域网中的路由器、交换机和集线器，教室里的桌子和凳子等。这些对象有很多相似的地方，如果能把它们相同的部分提取出来共享，则能节省大量的系统资源，这就是享元模式的产生背景。

### 享元模式的定义与特点
享元（Flyweight）模式的定义：运用共享技术来有効地支持大量细粒度对象的复用。它通过共享已经存在的又橡来大幅度减少需要创建的对象数量、避免大量相似类的开销，从而提高系统资源的利用率。
<br/>
享元模式的主要优点是：相同对象只要保存一份，这降低了系统中对象的数量，从而降低了系统中细粒度对象给内存带来的压力。
<br/>
其主要缺点是：
- 1.为了使对象可以共享，需要将一些不能共享的状态外部化，这将增加程序的复杂性。
- 2.读取享元模式的外部状态会使得运行时间稍微变长。

### 享元模式的结构与实现
享元模式中存在以下两种状态：
- 1.内部状态，即不会随着环境的改变而改变的可共享部分；
- 2.外部状态，指随环境改变而改变的不可以共享的部分。享元模式的实现要领就是区分应用中的这两种状态，并将外部状态外部化。下面来分析其基本结构和实现方法。

#### 1. 模式的结构
享元模式的主要角色有如下。
- 1.抽象享元角色（Flyweight）:是所有的具体享元类的基类，为具体享元规范需要实现的公共接口，非享元的外部状态以参数的形式通过方法传入。
- 2.具体享元（Concrete Flyweight）角色：实现抽象享元角色中所规定的接口。
- 3.非享元（Unsharable Flyweight)角色：是不可以共享的外部状态，它以参数的形式注入具体享元的相关方法中。
- 4.享元工厂（Flyweight Factory）角色：负责创建和管理享元角色。当客户对象请求一个享元对象时，享元工厂检査系统中是否存在符合要求的享元对象，如果存在则提供给客户；如果不存在的话，则创建一个新的享元对象。

<br/>
图 1 是享元模式的结构图。图中的 UnsharedConcreteFlyweight 是与淳元角色，里面包含了非共享的外部状态信息 info；而 Flyweight 是抽象享元角色，里面包含了享元方法 operation(UnsharedConcreteFlyweight state)，非享元的外部状态以参数的形式通过该方法传入；ConcreteFlyweight 是具体享元角色，包含了关键字 key，它实现了抽象享元接口；FlyweightFactory 是享元工厂角色，它逝关键字 key 来管理具体享元；客户角色通过享元工厂获取具体享元，并访问具体享元的相关方法。
<br/>
![](/images/design/42.gif)
<br/>
图1 享元模式的结构图

#### 2. 模式的实现
享元模式的实现代码如下：
```java
package flyweight;
import java.util.HashMap;
public class FlyweightPattern
{
    public static void main(String[] args)
    {
        FlyweightFactory factory=new FlyweightFactory();
        Flyweight f01=factory.getFlyweight("a");
        Flyweight f02=factory.getFlyweight("a");
        Flyweight f03=factory.getFlyweight("a");
        Flyweight f11=factory.getFlyweight("b");
        Flyweight f12=factory.getFlyweight("b");       
        f01.operation(new UnsharedConcreteFlyweight("第1次调用a。"));       
        f02.operation(new UnsharedConcreteFlyweight("第2次调用a。"));       
        f03.operation(new UnsharedConcreteFlyweight("第3次调用a。"));       
        f11.operation(new UnsharedConcreteFlyweight("第1次调用b。"));       
        f12.operation(new UnsharedConcreteFlyweight("第2次调用b。"));
    }
}
//非享元角色
class UnsharedConcreteFlyweight
{
    private String info;
    UnsharedConcreteFlyweight(String info)
    {
        this.info=info;
    }
    public String getInfo()
    {
        return info;
    }
    public void setInfo(String info)
    {
        this.info=info;
    }
}
//抽象享元角色
interface Flyweight
{
    public void operation(UnsharedConcreteFlyweight state);
}
//具体享元角色
class ConcreteFlyweight implements Flyweight
{
    private String key;
    ConcreteFlyweight(String key)
    {
        this.key=key;
        System.out.println("具体享元"+key+"被创建！");
    }
    public void operation(UnsharedConcreteFlyweight outState)
    {
        System.out.print("具体享元"+key+"被调用，");
        System.out.println("非享元信息是:"+outState.getInfo());
    }
}
//享元工厂角色
class FlyweightFactory
{
    private HashMap<String, Flyweight> flyweights=new HashMap<String, Flyweight>();
    public Flyweight getFlyweight(String key)
    {
        Flyweight flyweight=(Flyweight)flyweights.get(key);
        if(flyweight!=null)
        {
            System.out.println("具体享元"+key+"已经存在，被成功获取！");
        }
        else
        {
            flyweight=new ConcreteFlyweight(key);
            flyweights.put(key, flyweight);
        }
        return flyweight;
    }
}
```

### 享元模式的应用实例
#### 【例1】享元模式在五子棋游戏中的应用。
分析：五子棋同围棋一样，包含多个“黑”或“白”颜色的棋子，所以用享元模式比较好。
<br/>
本实例中的棋子（ChessPieces）类是抽象享元角色，它包含了一个落子的 DownPieces(Graphics g,Point pt) 方法；白子（WhitePieces）和黑子（BlackPieces）类是具体享元角色，它实现了落子方法；Point 是非享元角色，它指定了落子的位置；WeiqiFactory 是享元工厂角色，它通过 ArrayList 来管理棋子，并且提供了获取白子或者黑子的 getChessPieces(String type) 方法；客户类（Chessboard）利用 Graphics 组件在框架窗体中绘制一个棋盘，并实现 mouseClicked(MouseEvent e) 事件处理方法，该方法根据用户的选择从享元工厂中获取白子或者黑子并落在棋盘上。图 2 所示是其结构图。
<br/>
![](/images/design/43.gif)
<br/>
图2 五子棋游戏的结构图
<br/>
程序代码如下：
```java
package flyweight;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
public class WzqGame
{
    public static void main(String[] args)
    {
        new Chessboard();
    }
}
//棋盘
class Chessboard extends MouseAdapter
{
    WeiqiFactory wf;
    JFrame f;   
    Graphics g;
    JRadioButton wz;
    JRadioButton bz;
    private final int x=50;
    private final int y=50;
    private final int w=40;    //小方格宽度和高度
    private final int rw=400;    //棋盘宽度和高度
    Chessboard()
    {
        wf=new WeiqiFactory();
        f=new JFrame("享元模式在五子棋游戏中的应用");
        f.setBounds(100,100,500,550);
        f.setVisible(true);       
        f.setResizable(false);
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        JPanel SouthJP=new JPanel();
        f.add("South",SouthJP);
        wz=new JRadioButton("白子");
        bz=new JRadioButton("黑子",true);
        ButtonGroup group=new ButtonGroup();
        group.add(wz);
        group.add(bz);
        SouthJP.add(wz);
        SouthJP.add(bz);      
        JPanel CenterJP=new JPanel();
        CenterJP.setLayout(null);
        CenterJP.setSize(500, 500);
        CenterJP.addMouseListener(this);
        f.add("Center",CenterJP);      
        try
        {
            Thread.sleep(500);
        }
        catch(InterruptedException e)
        {
            e.printStackTrace();
        }               
        g=CenterJP.getGraphics();
        g.setColor(Color.BLUE);   
        g.drawRect(x, y, rw, rw);
        for(int i=1;i<10;i++)
        {
            //绘制第i条竖直线
            g.drawLine(x+(i*w),y,x+(i*w),y+rw);
            //绘制第i条水平线
            g.drawLine(x,y+(i*w),x+rw,y+(i*w));
        }   
    }
    public void mouseClicked(MouseEvent e)
    {
        Point pt=new Point(e.getX()-15,e.getY()-15);
        if(wz.isSelected())
        {
            ChessPieces c1=wf.getChessPieces("w");
            c1.DownPieces(g,pt);
        }
        else if(bz.isSelected())
        {
            ChessPieces c2=wf.getChessPieces("b");       
            c2.DownPieces(g,pt);  
        }
    }
}
//抽象享元角色：棋子
interface ChessPieces
{
    public void DownPieces(Graphics g,Point pt);    //下子
}
//具体享元角色：白子
class WhitePieces implements ChessPieces
{
    public void DownPieces(Graphics g,Point pt)
    {       
        g.setColor(Color.WHITE);
        g.fillOval(pt.x,pt.y,30,30);
    }
}
//具体享元角色：黑子
class BlackPieces implements ChessPieces
{
    public void DownPieces(Graphics g,Point pt)
    {
        g.setColor(Color.BLACK);
        g.fillOval(pt.x,pt.y,30,30);
    }
}
//享元工厂角色
class WeiqiFactory
{
    private ArrayList<ChessPieces> qz;   
    public WeiqiFactory()
    {
        qz=new ArrayList<ChessPieces>();
        ChessPieces w=new WhitePieces();
        qz.add(w);
        ChessPieces b=new BlackPieces();
        qz.add(b);
    }   
    public ChessPieces getChessPieces(String type)
    {
        if(type.equalsIgnoreCase("w"))
        {
            return (ChessPieces)qz.get(0);
        }
        else if(type.equalsIgnoreCase("b"))
        {
            return (ChessPieces)qz.get(1);
        }
        else
        {
            return null;
        }
    }
}
```

### 享元模式的应用场景
前面分析了享元模式的结构与特点，下面分析它适用的应用场景。享元模式是通过减少内存中对象的数量来节省内存空间的，所以以下几种情形适合采用享元模式。
- 1.系统中存在大量相同或相似的对象，这些对象耗费大量的内存资源。
- 2.大部分的对象可以按照内部状态进行分组，且可将不同部分外部化，这样每一个组只需保存一个内部状态。
- 3.由于享元模式需要额外维护一个保存享元的数据结构，所以应当在有足够多的享元实例时才值得使用享元模式。

### 享元模式的扩展
在前面介绍的享元模式中，其结构图通常包含可以共享的部分和不可以共享的部分。在实际使用过程中，有时候会稍加改变，即存在两种特殊的享元模式：单纯享元模式和复合享元模式，下面分别对它们进行简单介绍。

#### (1) 单纯享元模式，这种享元模式中的所有的具体享元类都是可以共享的，不存在非共享的具体享元类，其结构图如图 4 所示
![](/images/design/44.gif)
<br/>
图4 单纯享元模式的结构图
#### (2) 复合享元模式，这种享元模式中的有些享元对象是由一些单纯享元对象组合而成的，它们就是复合享元对象。虽然复合享元对象本身不能共享，但它们可以分解成单纯享元对象再被共享，其结构图如图 5 所示。
![](/images/design/45.gif)

## 12.组合模式（详解版）
在现实生活中，存在很多“部分-整体”的关系，例如，大学中的部门与学院、总公司中的部门与分公司、学习用品中的书与书包、生活用品中的衣月艮与衣柜以及厨房中的锅碗瓢盆等。在软件开发中也是这样，例如，文件系统中的文件与文件夹、窗体程序中的简单控件与容器控件等。对这些简单对象与复合对象的处理，如果用组合模式来实现会很方便。

### 组合模式的定义与特点
组合（Composite）模式的定义：有时又叫作部分-整体模式，它是一种将对象组合成树状的层次结构的模式，用来表示“部分-整体”的关系，使用户对单个对象和组合对象具有一致的访问性。
<br/>
组合模式的主要优点有：
- 1.组合模式使得客户端代码可以一致地处理单个对象和组合对象，无须关心自己处理的是单个对象，还是组合对象，这简化了客户端代码；
- 2.更容易在组合体内加入新的对象，客户端不会因为加入了新的对象而更改源代码，满足“开闭原则”；
<br/>
其主要缺点是：
- 设计较复杂，客户端需要花更多时间理清类之间的层次关系；
- 不容易限制容器中的构件；
- 不容易用继承的方法来增加构件的新功能；
### 组合模式的结构与实现
组合模式的结构不是很复杂，下面对它的结构和实现进行分析。
#### 1. 模式的结构
组合模式包含以下主要角色。
- 1.抽象构件（Component）角色：它的主要作用是为树叶构件和树枝构件声明公共接口，并实现它们的默认行为。在透明式的组合模式中抽象构件还声明访问和管理子类的接口；在安全式的组合模式中不声明访问和管理子类的接口，管理工作由树枝构件完成。
- 2.树叶构件（Leaf）角色：是组合中的叶节点对象，它没有子节点，用于实现抽象构件角色中 声明的公共接口。
- 3.树枝构件（Composite）角色：是组合中的分支节点对象，它有子节点。它实现了抽象构件角色中声明的接口，它的主要作用是存储和管理子部件，通常包含 Add()、Remove()、GetChild() 等方法。
<br/>
组合模式分为透明式的组合模式和安全式的组合模式。
<br/>
(1) 透明方式：在该方式中，由于抽象构件声明了所有子类中的全部方法，所以客户端无须区别树叶对象和树枝对象，对客户端来说是透明的。但其缺点是：树叶构件本来没有 Add()、Remove() 及 GetChild() 方法，却要实现它们（空实现或抛异常），这样会带来一些安全性问题。其结构图如图 1 所示。
<br/>
![](/images/design/46.gif)
<br/>
图1 透明式的组合模式的结构图
<br/>
(2) 安全方式：在该方式中，将管理子构件的方法移到树枝构件中，抽象构件和树叶构件没有对子对象的管理方法，这样就避免了上一种方式的安全性问题，但由于叶子和分支有不同的接口，客户端在调用时要知道树叶对象和树枝对象的存在，所以失去了透明性。其结构图如图 2 所示。
<br/>
![](/images/design/47.gif)
<br/>
图2 安全式的组合模式的结构图
<br/>
#### 2. 模式的实现
假如要访问集合 c0={leaf1,{leaf2,leaf3}} 中的元素，其对应的树状图如图 3 所示。
![](/images/design/48.gif)
<br/>
图3 集合c0的树状图
<br/>
下面给出透明式的组合模式的实现代码，与安全式的组合模式的实现代码类似，只要对其做简单修改就可以了。
<br/>
```java
package composite;
import java.util.ArrayList;
public class CompositePattern
{
    public static void main(String[] args)
    {
        Component c0=new Composite(); 
        Component c1=new Composite(); 
        Component leaf1=new Leaf("1"); 
        Component leaf2=new Leaf("2"); 
        Component leaf3=new Leaf("3");          
        c0.add(leaf1); 
        c0.add(c1);
        c1.add(leaf2); 
        c1.add(leaf3);          
        c0.operation(); 
    }
}
//抽象构件
interface Component
{
    public void add(Component c);
    public void remove(Component c);
    public Component getChild(int i);
    public void operation();
}
//树叶构件
class Leaf implements Component
{
    private String name;
    public Leaf(String name)
    {
        this.name=name;
    }
    public void add(Component c){ }           
    public void remove(Component c){ }   
    public Component getChild(int i)
    {
        return null;
    }   
    public void operation()
    {
        System.out.println("树叶"+name+"：被访问！"); 
    }
}
//树枝构件
class Composite implements Component
{
    private ArrayList<Component> children=new ArrayList<Component>();   
    public void add(Component c)
    {
        children.add(c);
    }   
    public void remove(Component c)
    {
        children.remove(c);
    }   
    public Component getChild(int i)
    {
        return children.get(i);
    }   
    public void operation()
    {
        for(Object obj:children)
        {
            ((Component)obj).operation();
        }
    }    
}
```
```info
程序运行结果如下：
树叶1：被访问！
树叶2：被访问！
树叶3：被访问！
```

### 组合模式的应用实例
#### 【例1】用组合模式实现当用户在商店购物后，显示其所选商品信息，并计算所选商品总价的功能。
说明：假如李先生到韶关“天街e角”生活用品店购物，用 1 个红色小袋子装了 2 包婺源特产（单价 7.9 元）、1 张婺源地图（单价 9.9 元）；用 1 个白色小袋子装了 2 包韶关香藉（单价 68 元）和 3 包韶关红茶（单价 180 元）；用 1 个中袋子装了前面的红色小袋子和 1 个景德镇瓷器（单价 380 元）；用 1 个大袋子装了前面的中袋子、白色小袋子和 1 双李宁牌运动鞋（单价 198 元）。
<br/>
最后“大袋子”中的内容有：{1 双李宁牌运动鞋（单价 198 元）、白色小袋子{2 包韶关香菇（单价 68 元）、3 包韶关红茶（单价 180 元）}、中袋子{1 个景德镇瓷器（单价 380 元）、红色小袋子{2 包婺源特产（单价 7.9 元）、1 张婺源地图（单价 9.9 元）}}}，现在要求编程显示李先生放在大袋子中的所有商品信息并计算要支付的总价。
<br/>
本实例可按安全组合模式设计，其结构图如图 4 所示。
<br/>
![](/images/design/49.gif)
<br/>
图4 韶关“天街e角”店购物的结构图
<br/>
```java
package composite;
import java.util.ArrayList;
public class ShoppingTest
{
    public static void main(String[] args)
    {
        float s=0;
        Bags BigBag,mediumBag,smallRedBag,smallWhiteBag;
        Goods sp;
        BigBag=new Bags("大袋子");
        mediumBag=new Bags("中袋子");
        smallRedBag=new Bags("红色小袋子");
        smallWhiteBag=new Bags("白色小袋子");               
        sp=new Goods("婺源特产",2,7.9f);
        smallRedBag.add(sp);
        sp=new Goods("婺源地图",1,9.9f);
        smallRedBag.add(sp);       
        sp=new Goods("韶关香菇",2,68);
        smallWhiteBag.add(sp);
        sp=new Goods("韶关红茶",3,180);
        smallWhiteBag.add(sp);       
        sp=new Goods("景德镇瓷器",1,380);
        mediumBag.add(sp);
        mediumBag.add(smallRedBag);       
        sp=new Goods("李宁牌运动鞋",1,198);
        BigBag.add(sp);
        BigBag.add(smallWhiteBag);
        BigBag.add(mediumBag);
        System.out.println("您选购的商品有：");
        BigBag.show();
        s=BigBag.calculation();       
        System.out.println("要支付的总价是："+s+"元");
    }
}
//抽象构件：物品
interface Articles
{
    public float calculation(); //计算
    public void show();
}
//树叶构件：商品
class Goods implements Articles
{
    private String name;     //名字
    private int quantity;    //数量
    private float unitPrice; //单价
    public Goods(String name,int quantity,float unitPrice)
    {
        this.name=name;
        this.quantity=quantity;
        this.unitPrice=unitPrice;
    }   
    public float calculation()
    {
        return quantity*unitPrice; 
    }
    public void show()
    {
        System.out.println(name+"(数量："+quantity+"，单价："+unitPrice+"元)");
    }
}
//树枝构件：袋子
class Bags implements Articles
{
    private String name;     //名字   
    private ArrayList<Articles> bags=new ArrayList<Articles>();   
    public Bags(String name)
    {
        this.name=name;       
    }
    public void add(Articles c)
    {
        bags.add(c);
    }   
    public void remove(Articles c)
    {
        bags.remove(c);
    }   
    public Articles getChild(int i)
    {
        return bags.get(i);
    }   
    public float calculation()
    {
        float s=0;
        for(Object obj:bags)
        {
            s+=((Articles)obj).calculation();
        }
        return s;
    }
    public void show()
    {
        for(Object obj:bags)
        {
            ((Articles)obj).show();
        }
    }
}
```
```info
程序运行结果如下：
您选购的商品有：
李宁牌运动鞋(数量：1，单价：198.0元)
韶关香菇(数量：2，单价：68.0元)
韶关红茶(数量：3，单价：180.0元)
景德镇瓷器(数量：1，单价：380.0元)
婺源特产(数量：2，单价：7.9元)
婺源地图(数量：1，单价：9.9元)
要支付的总价是：1279.7元
```
### 组合模式的应用场景
前面分析了组合模式的结构与特点，下面分析它适用的以下应用场景。
- 1.在需要表示一个对象整体与部分的层次结构的场合。
- 2.要求对用户隐藏组合对象与单个对象的不同，用户可以用统一的接口使用组合结构中的所有对象的场合。
### 组合模式的扩展
如果对前面介绍的组合模式中的树叶节点和树枝节点进行抽象，也就是说树叶节点和树枝节点还有子节点，这时组合模式就扩展成复杂的组合模式了，如 Java AWT/Swing 中的简单组件 JTextComponent 有子类 JTextField、JTextArea，容器组件 Container 也有子类 Window、Panel。复杂的组合模式的结构图如图 5 所示。
<br/>
![](/images/design/50.gif)
<br/>

## 行为型模式概述（行为型模式的分类）
行为型模式用于描述程序在运行时复杂的流程控制，即描述多个类或对象之间怎样相互协作共同完成单个对象都无法单独完成的任务，它涉及算法与对象间职责的分配。
<br/>
行为型模式分为类行为模式和对象行为模式，前者采用继承机制来在类间分派行为，后者采用组合或聚合在对象间分配行为。由于组合关系或聚合关系比继承关系耦合度低，满足“合成复用原则”，所以对象行为模式比类行为模式具有更大的灵活性。
- 1.模板方法（Template Method）模式：定义一个操作中的算法骨架，将算法的一些步骤延迟到子类中，使得子类在可以不改变该算法结构的情况下重定义该算法的某些特定步骤。
- 2.策略（Strategy）模式：定义了一系列算法，并将每个算法封装起来，使它们可以相互替换，且算法的改变不会影响使用算法的客户。
- 3.命令（Command）模式：将一个请求封装为一个对象，使发出请求的责任和执行请求的责任分割开。
- 4.职责链（Chain of Responsibility）模式：把请求从链中的一个对象传到下一个对象，直到请求被响应为止。通过这种方式去除对象之间的耦合。
- 5.状态（State）模式：允许一个对象在其内部状态发生改变时改变其行为能力。
- 6.观察者（Observer）模式：多个对象间存在一对多关系，当一个对象发生改变时，把这种改变通知给其他多个对象，从而影响其他对象的行为。
- 7.中介者（Mediator）模式：定义一个中介对象来简化原有对象之间的交互关系，降低系统中对象间的耦合度，使原有对象之间不必相互了解。
- 8.迭代器（Iterator）模式：提供一种方法来顺序访问聚合对象中的一系列数据，而不暴露聚合对象的内部表示。
- 9.访问者（Visitor）模式：在不改变集合元素的前提下，为一个集合中的每个元素提供多种访问方式，即每个元素有多个访问者对象访问。
- 10.备忘录（Memento）模式：在不破坏封装性的前提下，获取并保存一个对象的内部状态，以便以后恢复它。
- 11.解释器（Interpreter）模式：提供如何定义语言的文法，以及对语言句子的解释方法，即解释器。
<br/>
以上 11 种行为型模式，除了模板方法模式和解释器模式是类行为型模式，其他的全部属于对象行为型模式，下面我们将详细介绍它们的特点、结构与应用。

## 13.模板方法模式（模板方法设计模式）详解
在面向对象程序设计过程中，程序员常常会遇到这种情况：设计一个系统时知道了算法所需的关键步骤，而且确定了这些步骤的执行顺序，但某些步骤的具体实现还未知，或者说某些步骤的实现与具体的环境相关。
<br/>
例如，去银行办理业务一般要经过以下4个流程：取号、排队、办理具体业务、对银行工作人员进行评分等，其中取号、排队和对银行工作人员进行评分的业务对每个客户是一样的，可以在父类中实现，但是办理具体业务却因人而异，它可能是存款、取款或者转账等，可以延迟到子类中实现。
<br/>
这样的例子在生活中还有很多，例如，一个人每天会起床、吃饭、做事、睡觉等，其中“做事”的内容每天可能不同。我们把这些规定了流程或格式的实例定义成模板，允许使用者根据自己的需求去更新它，例如，简历模板、论文模板、Word 中模板文件等。
<br/>
### 模式的定义与特点
模板方法（Template Method）模式的定义如下：定义一个操作中的算法骨架，而将算法的一些步骤延迟到子类中，使得子类可以不改变该算法结构的情况下重定义该算法的某些特定步骤。它是一种类行为型模式。
<br/>
该模式的主要优点如下。
- 1.它封装了不变部分，扩展可变部分。它把认为是不变部分的算法封装到父类中实现，而把可变部分算法由子类继承实现，便于子类继续扩展。
- 2.它在父类中提取了公共的部分代码，便于代码复用。
- 3.部分方法是由子类实现的，因此子类可以通过扩展方式增加相应的功能，符合开闭原则。
<br/>
该模式的主要缺点如下。
- 1.对每个不同的实现都需要定义一个子类，这会导致类的个数增加，系统更加庞大，设计也更加抽象。
- 2.父类中的抽象方法由子类实现，子类执行的结果会影响父类的结果，这导致一种反向的控制结构，它提高了代码阅读的难度。
### 模式的结构与实现
模板方法模式需要注意抽象类与具体子类之间的协作。它用到了虚函数的多态性技术以及“不用调用我，让我来调用你”的反向控制技术。现在来介绍它们的基本结构。
#### 1. 模式的结构
模板方法模式包含以下主要角色。
<br/>
(1) 抽象类（Abstract Class）：负责给出一个算法的轮廓和骨架。它由一个模板方法和若干个基本方法构成。这些方法的定义如下。
<br/>
① 模板方法：定义了算法的骨架，按某种顺序调用其包含的基本方法。
② 基本方法：是整个算法中的一个步骤，包含以下几种类型。
- 抽象方法：在抽象类中申明，由具体子类实现。
- 具体方法：在抽象类中已经实现，在具体子类中可以继承或重写它。
- 钩子方法：在抽象类中已经实现，包括用于判断的逻辑方法和需要子类重写的空方法两种。
<br/>
(2) 具体子类（Concrete Class）：实现抽象类中所定义的抽象方法和钩子方法，它们是一个顶级逻辑的一个组成步骤。
<br/>
模板方法模式的结构图如图 1 所示。<br/>
![](/images/design/51.gif)
<br/>
图1 模板方法模式的结构图
<br/>
```java
package templateMethod;
public class TemplateMethodPattern
{
    public static void main(String[] args)
    {
        AbstractClass tm=new ConcreteClass();
        tm.TemplateMethod();
    }
}
//抽象类
abstract class AbstractClass
{
    public void TemplateMethod() //模板方法
    {
        SpecificMethod();
        abstractMethod1();          
         abstractMethod2();
    }  
    public void SpecificMethod() //具体方法
    {
        System.out.println("抽象类中的具体方法被调用...");
    }   
    public abstract void abstractMethod1(); //抽象方法1
    public abstract void abstractMethod2(); //抽象方法2
}
//具体子类
class ConcreteClass extends AbstractClass
{
    public void abstractMethod1()
    {
        System.out.println("抽象方法1的实现被调用...");
    }   
    public void abstractMethod2()
    {
        System.out.println("抽象方法2的实现被调用...");
    }
}
```
```info
程序的运行结果如下：
抽象类中的具体方法被调用...
抽象方法1的实现被调用...
抽象方法2的实现被调用...
```
### 模式的应用实例
#### 【例1】用模板方法模式实现出国留学手续设计程序。
分析：出国留学手续一般经过以下流程：索取学校资料，提出入学申请，办理因私出国护照、出境卡和公证，申请签证，体检、订机票、准备行装，抵达目标学校等，其中有些业务对各个学校是一样的，但有些业务因学校不同而不同，所以比较适合用模板方法模式来实现。
<br/>
在本实例中，我们先定义一个出国留学的抽象类 StudyAbroad，里面包含了一个模板方法 TemplateMethod()，该方法中包含了办理出国留学手续流程中的各个基本方法，其中有些方法的处理由于各国都一样，所以在抽象类中就可以实现，但有些方法的处理各国是不同的，必须在其具体子类（如美国留学类 StudyInAmerica）中实现。如果再增加一个国家，只要增加一个子类就可以了，图 2 所示是其结构图
<br/>
![](/images/design/52.gif)
<br/>
图2 出国留学手续设计程序的结构图
<br/>
```java
package templateMethod;
public class StudyAbroadProcess
{
    public static void main(String[] args)
    {
        StudyAbroad tm=new StudyInAmerica();
        tm.TemplateMethod();
    }
}
//抽象类: 出国留学
abstract class StudyAbroad
{
    public void TemplateMethod() //模板方法
    {
        LookingForSchool(); //索取学校资料
        ApplyForEnrol();    //入学申请      
        ApplyForPassport(); //办理因私出国护照、出境卡和公证
        ApplyForVisa();     //申请签证
        ReadyGoAbroad();    //体检、订机票、准备行装
        Arriving();         //抵达
    }              
    public void ApplyForPassport()
    {
        System.out.println("三.办理因私出国护照、出境卡和公证：");
        System.out.println("  1）持录取通知书、本人户口簿或身份证向户口所在地公安机关申请办理因私出国护照和出境卡。");
        System.out.println("  2）办理出生公证书，学历、学位和成绩公证，经历证书，亲属关系公证，经济担保公证。");
    }
    public void ApplyForVisa()
    {
        System.out.println("四.申请签证：");
        System.out.println("  1）准备申请国外境签证所需的各种资料，包括个人学历、成绩单、工作经历的证明；个人及家庭收入、资金和财产证明；家庭成员的关系证明等；");
        System.out.println("  2）向拟留学国家驻华使(领)馆申请入境签证。申请时需按要求填写有关表格，递交必需的证明材料，缴纳签证。有的国家(比如美国、英国、加拿大等)在申请签证时会要求申请人前往使(领)馆进行面试。");
    }
    public void ReadyGoAbroad()
    {
        System.out.println("五.体检、订机票、准备行装：");
        System.out.println("  1）进行身体检查、免疫检查和接种传染病疫苗；");
        System.out.println("  2）确定机票时间、航班和转机地点。");
    }
    public abstract void LookingForSchool();//索取学校资料
    public abstract void ApplyForEnrol();   //入学申请
    public abstract void Arriving();        //抵达
}
//具体子类: 美国留学
class StudyInAmerica extends StudyAbroad
{
    @Override
    public void LookingForSchool()
    {
        System.out.println("一.索取学校以下资料：");
        System.out.println("  1）对留学意向国家的政治、经济、文化背景和教育体制、学术水平进行较为全面的了解；");
        System.out.println("  2）全面了解和掌握国外学校的情况，包括历史、学费、学制、专业、师资配备、教学设施、学术地位、学生人数等；");
        System.out.println("  3）了解该学校的住宿、交通、医疗保险情况如何；");
        System.out.println("  4）该学校在中国是否有授权代理招生的留学中介公司？");
        System.out.println("  5）掌握留学签证情况；");
        System.out.println("  6）该国政府是否允许留学生合法打工？");
        System.out.println("  8）毕业之后可否移民？");
        System.out.println("  9）文凭是否受到我国认可？");
    }
    @Override
    public void ApplyForEnrol()
    {
        System.out.println("二.入学申请：");
        System.out.println("  1）填写报名表；");
        System.out.println("  2）将报名表、个人学历证明、最近的学习成绩单、推荐信、个人简历、托福或雅思语言考试成绩单等资料寄往所申请的学校；");
        System.out.println("  3）为了给签证办理留有充裕的时间，建议越早申请越好，一般提前1年就比较从容。");       
    }
    @Override
    public void Arriving()
    {
        System.out.println("六.抵达目标学校：");
        System.out.println("  1）安排住宿；");
        System.out.println("  2）了解校园及周边环境。");
    }
}
```
### 模式的应用场景
模板方法模式通常适用于以下场景。
- 1.算法的整体步骤很固定，但其中个别部分易变时，这时候可以使用模板方法模式，将容易变的部分抽象出来，供子类实现。
- 2.当多个子类存在公共的行为时，可以将其提取出来并集中到一个公共父类中以避免代码重复。首先，要识别现有代码中的不同之处，并且将不同之处分离为新的操作。最后，用一个调用这些新的操作的模板方法来替换这些不同的代码。
- 3.当需要控制子类的扩展时，模板方法只在特定点调用钩子操作，这样就只允许在这些点进行扩展。
### 模式的扩展
在模板方法模式中，基本方法包含：抽象方法、具体方法和钩子方法，正确使用“钩子方法”可以使得子类控制父类的行为。如下面例子中，可以通过在具体子类中重写钩子方法 HookMethod1() 和 HookMethod2() 来改变抽象父类中的运行结果，其结构图如图 3 所示。
<br/>
![](/images/design/53.gif)
<br/>
图3 含钩子方法的模板方法模式的结构图
```java
package templateMethod;
public class HookTemplateMethod
{
    public static void main(String[] args)
    {
        HookAbstractClass tm=new HookConcreteClass();
        tm.TemplateMethod();
    }
}
//含钩子方法的抽象类
abstract class HookAbstractClass
{
    public void TemplateMethod() //模板方法
    {
        abstractMethod1();
        HookMethod1();
        if(HookMethod2())
        {
            SpecificMethod();   
        }
         abstractMethod2();
    }  
    public void SpecificMethod() //具体方法
    {
        System.out.println("抽象类中的具体方法被调用...");
    }
    public void HookMethod1(){}  //钩子方法1
    public boolean HookMethod2() //钩子方法2
    {
        return true;
    }
    public abstract void abstractMethod1(); //抽象方法1
    public abstract void abstractMethod2(); //抽象方法2
}
//含钩子方法的具体子类
class HookConcreteClass extends HookAbstractClass
{
    public void abstractMethod1()
    {
        System.out.println("抽象方法1的实现被调用...");
    }   
    public void abstractMethod2()
    {
        System.out.println("抽象方法2的实现被调用...");
    }   
    public void HookMethod1()
    {
        System.out.println("钩子方法1被重写...");
    }
    public boolean HookMethod2()
    {
        return false;
    }
}
```
如果钩子方法 HookMethod1() 和钩子方法 HookMethod2() 的代码改变，则程序的运行结果也会改变。

## 14.策略模式（策略设计模式）详解
在现实生活中常常遇到实现某种目标存在多种策略可供选择的情况，例如，出行旅游可以乘坐飞机、乘坐火车、骑自行车或自己开私家车等，超市促销可以釆用打折、送商品、送积分等方法。
<br/>
在软件开发中也常常遇到类似的情况，当实现某一个功能存在多种算法或者策略，我们可以根据环境或者条件的不同选择不同的算法或者策略来完成该功能，如数据排序策略有冒泡排序、选择排序、插入排序、二叉树排序等。
<br/>
如果使用多重条件转移语句实现（即硬编码），不但使条件语句变得很复杂，而且增加、删除或更换算法要修改原代码，不易维护，违背开闭原则。如果采用策略模式就能很好解决该问题。
<br/>
### 策略模式的定义与特点
策略（Strategy）模式的定义：该模式定义了一系列算法，并将每个算法封装起来，使它们可以相互替换，且算法的变化不会影响使用算法的客户。策略模式属于对象行为模式，它通过对算法进行封装，把使用算法的责任和算法的实现分割开来，并委派给不同的对象对这些算法进行管理。
<br/>
策略模式的主要优点如下。
- 1.多重条件语句不易维护，而使用策略模式可以避免使用多重条件语句。
- 2.策略模式提供了一系列的可供重用的算法族，恰当使用继承可以把算法族的公共代码转移到父类里面，从而避免重复的代码。
- 3.策略模式可以提供相同行为的不同实现，客户可以根据不同时间或空间要求选择不同的。
- 4.策略模式提供了对开闭原则的完美支持，可以在不修改原代码的情况下，灵活增加新算法。
- 5.策略模式把算法的使用放到环境类中，而算法的实现移到具体策略类中，实现了二者的分离。
<br/>
其主要缺点如下。
- 1.客户端必须理解所有策略算法的区别，以便适时选择恰当的算法类。
- 2.策略模式造成很多的策略类。

### 策略模式的结构与实现
策略模式是准备一组算法，并将这组算法封装到一系列的策略类里面，作为一个抽象策略类的子类。策略模式的重心不是如何实现算法，而是如何组织这些算法，从而让程序结构更加灵活，具有更好的维护性和扩展性，现在我们来分析其基本结构和实现方法。
<br/>
#### 1. 模式的结构
策略模式的主要角色如下。
- 1.抽象策略（Strategy）类：定义了一个公共接口，各种不同的算法以不同的方式实现这个接口，环境角色使用这个接口调用不同的算法，一般使用接口或抽象类实现。
- 2.具体策略（Concrete Strategy）类：实现了抽象策略定义的接口，提供具体的算法实现。
- 3.环境（Context）类：持有一个策略类的引用，最终给客户端调用。
<br/>
其结构图如图 1 所示。
<br/>
![](/images/design/54.gif)
<br/>
#### 2. 模式的实现
策略模式的实现代码如下：
```java
package strategy;
public class StrategyPattern
{
    public static void main(String[] args)
    {
        Context c=new Context();
        Strategy s=new ConcreteStrategyA();
        c.setStrategy(s);
        c.strategyMethod();
        System.out.println("-----------------");
        s=new ConcreteStrategyB();
        c.setStrategy(s);
        c.strategyMethod();
    }
}
//抽象策略类
interface Strategy
{   
    public void strategyMethod();    //策略方法
}
//具体策略类A
class ConcreteStrategyA implements Strategy
{
    public void strategyMethod()
    {
        System.out.println("具体策略A的策略方法被访问！");
    }
}
//具体策略类B
class ConcreteStrategyB implements Strategy
{
  public void strategyMethod()
  {
      System.out.println("具体策略B的策略方法被访问！");
  }
}
//环境类
class Context
{
    private Strategy strategy;
    public Strategy getStrategy()
    {
        return strategy;
    }
    public void setStrategy(Strategy strategy)
    {
        this.strategy=strategy;
    }
    public void strategyMethod()
    {
        strategy.strategyMethod();
    }
}
```

### 策略模式的应用实例
#### 【例1】策略模式在“大闸蟹”做菜中的应用。
分析：关于大闸蟹的做法有很多种，我们以清蒸大闸蟹和红烧大闸蟹两种方法为例，介绍策略模式的应用。
<br/>
首先，定义一个大闸蟹加工的抽象策略类（CrabCooking），里面包含了一个做菜的抽象方法 CookingMethod()；然后，定义清蒸大闸蟹（SteamedCrabs）和红烧大闸蟹（BraisedCrabs）的具体策略类，它们实现了抽象策略类中的抽象方法；由于本程序要显示做好的结果图（[点此下载要显示的结果图](http://c.biancheng.net/uploads/soft/181113/3-1Q116104147.zip)），所以将具体策略类定义成 JLabel 的子类；最后，定义一个厨房（Kitchen）环境类，它具有设置和选择做菜策略的方法；客户类通过厨房类获取做菜策略，并把做菜结果图在窗体中显示出来，图 2 所示是其结构图。
<br/>
![](/images/design/55.gif)
<br/>
图2 大闸蟹做菜策略的结构图
<br/>
```java
package strategy;
import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
public class CrabCookingStrategy implements ItemListener
{
    private JFrame f;
    private JRadioButton qz,hs;
    private JPanel CenterJP,SouthJP;
    private Kitchen cf;    //厨房
    private CrabCooking qzx,hsx;    //大闸蟹加工者   
    CrabCookingStrategy()
    {
        f=new JFrame("策略模式在大闸蟹做菜中的应用");
        f.setBounds(100,100,500,400);
        f.setVisible(true);       
        f.setResizable(false);
        f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        SouthJP=new JPanel();
        CenterJP=new JPanel();
        f.add("South",SouthJP);
        f.add("Center",CenterJP);
        qz=new JRadioButton("清蒸大闸蟹");
        hs=new JRadioButton("红烧大闸蟹");
        qz.addItemListener(this);
        hs.addItemListener(this);
        ButtonGroup group=new ButtonGroup();
        group.add(qz);
        group.add(hs);
        SouthJP.add(qz);
        SouthJP.add(hs);
        //---------------------------------
        cf=new Kitchen();    //厨房
        qzx=new SteamedCrabs();    //清蒸大闸蟹类
        hsx=new BraisedCrabs();    //红烧大闸蟹类
    }
    public void itemStateChanged(ItemEvent e)
    {
        JRadioButton jc=(JRadioButton) e.getSource();
        if(jc==qz)
        {
            cf.setStrategy(qzx);
            cf.CookingMethod(); //清蒸
        }
        else if(jc==hs)
        {
            cf.setStrategy(hsx);
            cf.CookingMethod(); //红烧
        }
        CenterJP.removeAll();
        CenterJP.repaint();
        CenterJP.add((Component)cf.getStrategy());       
        f.setVisible(true);
    }
    public static void main(String[] args)
    {       
        new CrabCookingStrategy();
    }
}
//抽象策略类：大闸蟹加工类
interface CrabCooking
{
    public void CookingMethod();    //做菜方法
}
//具体策略类：清蒸大闸蟹
class SteamedCrabs extends JLabel implements CrabCooking
{
    private static final long serialVersionUID=1L;
    public void CookingMethod()
    {
          this.setIcon(new ImageIcon("src/strategy/SteamedCrabs.jpg"));
          this.setHorizontalAlignment(CENTER);
    }
}
//具体策略类：红烧大闸蟹
class BraisedCrabs extends JLabel implements CrabCooking
{
    private static final long serialVersionUID=1L;
    public void CookingMethod()
    {
        this.setIcon(new ImageIcon("src/strategy/BraisedCrabs.jpg"));
        this.setHorizontalAlignment(CENTER);
    }
}
//环境类：厨房
class Kitchen
{
    private CrabCooking strategy;    //抽象策略
    public void setStrategy(CrabCooking strategy)
    {
        this.strategy=strategy;
    }
    public CrabCooking getStrategy()
    {
        return strategy;
    }
    public void CookingMethod()
    {
        strategy.CookingMethod();    //做菜   
    }
}
```

#### 【例2】用策略模式实现从韶关去婺源旅游的出行方式
分析：从韶关去婺源旅游有以下几种出行方式：坐火车、坐汽车和自驾车，所以该实例用策略模式比较适合，图 4 所示是其结构图。
<br/>
![](/images/design/56.gif)
<br/>
图4 婺源旅游结构图
### 策略模式的应用场景
策略模式在很多地方用到，如 Java SE 中的容器布局管理就是一个典型的实例，Java SE 中的每个容器都存在多种布局供用户选择。在程序设计中，通常在以下几种情况中使用策略模式较多。
- 1.一个系统需要动态地在几种算法中选择一种时，可将每个算法封装到策略类中。
- 2.一个类定义了多种行为，并且这些行为在这个类的操作中以多个条件语句的形式出现，可将每个条件分支移入它们各自的策略类中以代替这些条件语句。
- 3.系统中各算法彼此完全独立，且要求对客户隐藏具体算法的实现细节时。
- 4.系统要求使用算法的客户不应该知道其操作的数据时，可使用策略模式来隐藏与算法相关的[数据结构](http://c.biancheng.net/data_structure/)。
- 5.多个类只区别在表现行为不同，可以使用策略模式，在运行时动态选择具体要执行的行为。

### 策略模式的扩展
在一个使用策略模式的系统中，当存在的策略很多时，客户端管理所有策略算法将变得很复杂，如果在环境类中使用策略工厂模式来管理这些策略类将大大减少客户端的工作复杂度，其结构图如图 5 所示。
<br/>
![](/images/design/57.gif)
<br/>
图5 策略工厂模式的结构图

## 15.命令模式（详解版）
在软件开发系统中，常常出现“方法的请求者”与“方法的实现者”之间存在紧密的耦合关系。这不利于软件功能的扩展与维护。例如，想对行为进行“撤销、重做、记录”等处理都很不方便，因此“如何将方法的请求者与方法的实现者解耦？”变得很重要，命令模式能很好地解决这个问题。
<br/>
在现实生活中，这样的例子也很多，例如，电视机遥控器（命令发送者）通过按钮（具体命令）来遥控电视机（命令接收者），还有计算机键盘上的“功能键”等。
<br/>
### 命令模式的定义与特点
命令（Command）模式的定义如下：将一个请求封装为一个对象，使发出请求的责任和执行请求的责任分割开。这样两者之间通过命令对象进行沟通，这样方便将命令对象进行储存、传递、调用、增加与管理。
命令模式的主要优点如下。
- 1.降低系统的耦合度。命令模式能将调用操作的对象与实现该操作的对象解耦。
- 2.增加或删除命令非常方便。采用命令模式增加与删除命令不会影响其他类，它满足“开闭原则”，对扩展比较灵活。
- 3.可以实现宏命令。命令模式可以与组合模式结合，将多个命令装配成一个组合命令，即宏命令。
- 4.方便实现 Undo 和 Redo 操作。命令模式可以与后面介绍的备忘录模式结合，实现命令的撤销与恢复。
<br/>
其缺点是：可能产生大量具体命令类。因为计对每一个具体操作都需要设计一个具体命令类，这将增加系统的复杂性。
### 命令模式的结构与实现
可以将系统中的相关操作抽象成命令，使调用者与实现者相关分离，其结构如下。
#### 1. 模式的结构
命令模式包含以下主要角色。
- 1.抽象命令类（Command）角色：声明执行命令的接口，拥有执行命令的抽象方法 execute()。
- 2.具体命令角色（Concrete    Command）角色：是抽象命令类的具体实现类，它拥有接收者对象，并通过调用接收者的功能来完成命令要执行的操作。
- 3.实现者/接收者（Receiver）角色：执行命令功能的相关操作，是具体命令对象业务的真正实现者。
- 4.调用者/请求者（Invoker）角色：是请求的发送者，它通常拥有很多的命令对象，并通过访问命令对象来执行相关请求，它不直接访问接收者。
<br/>
![](/images/design/58.gif)
<br/>
图1 命令模式的结构图
#### 2. 模式的实现
```java
package command;
public class CommandPattern
{
    public static void main(String[] args)
    {
        Command cmd=new ConcreteCommand();
        Invoker ir=new Invoker(cmd);
        System.out.println("客户访问调用者的call()方法...");
        ir.call();
    }
}
//调用者
class Invoker
{
    private Command command;
    public Invoker(Command command)
    {
        this.command=command;
    }
    public void setCommand(Command command)
    {
        this.command=command;
    }
    public void call()
    {
        System.out.println("调用者执行命令command...");
        command.execute();
    }
}
//抽象命令
interface Command
{
    public abstract void execute();
}
//具体命令
class ConcreteCommand implements Command
{
    private Receiver receiver;
    ConcreteCommand()
    {
        receiver=new Receiver();
    }
    public void execute()
    {
        receiver.action();
    }
}
//接收者
class Receiver
{
    public void action()
    {
        System.out.println("接收者的action()方法被调用...");
    }
}
```
### 命令模式的应用实例
#### 【例1】用命令模式实现客户去餐馆吃早餐的实例。
分析：客户去餐馆可选择的早餐有肠粉、河粉和馄饨等，客户可向服务员选择以上早餐中的若干种，服务员将客户的请求交给相关的厨师去做。这里的点早餐相当于“命令”，服务员相当于“调用者”，厨师相当于“接收者”，所以用命令模式实现比较合适。
<br/>
首先，定义一个早餐类（Breakfast），它是抽象命令类，有抽象方法 cooking()，说明要做什么；再定义其子类肠粉类（ChangFen）、馄饨类（HunTun）和河粉类（HeFen），它们是具体命令类，实现早餐类的 cooking() 方法，但它们不会具体做，而是交给具体的厨师去做；具体厨师类有肠粉厨师（ChangFenChef）、馄蚀厨师（HunTunChef）和河粉厨师（HeFenChef），他们是命令的接收者，由于本实例要显示厨师做菜的效果图（[点此下载要显示的效果图](http://c.biancheng.net/uploads/soft/181113/3-1Q116125200.zip)），所以把每个厨师类定义为 JFrame 的子类；最后，定义服务员类（Waiter），它接收客户的做菜请求，并发出做菜的命令。客户类是通过服务员类来点菜的，图 2 所示是其结构图。
<br/>
![](/images/design/59.gif)
<br/>
```java
package command;
import javax.swing.*;
public class CookingCommand
{
    public static void main(String[] args)
    {
        Breakfast food1=new ChangFen();
        Breakfast food2=new HunTun();
        Breakfast food3=new HeFen();
        Waiter fwy=new Waiter();
        fwy.setChangFen(food1);//设置肠粉菜单
        fwy.setHunTun(food2);  //设置河粉菜单
        fwy.setHeFen(food3);   //设置馄饨菜单
        fwy.chooseChangFen();  //选择肠粉
        fwy.chooseHeFen();     //选择河粉
        fwy.chooseHunTun();    //选择馄饨
    }
}
//调用者：服务员
class Waiter
{
    private Breakfast changFen,hunTun,heFen;
    public void setChangFen(Breakfast f)
    {
        changFen=f;
    }
    public void setHunTun(Breakfast f)
    {
        hunTun=f;
    }
    public void setHeFen(Breakfast f)
    {
        heFen=f;
    }
    public void chooseChangFen()
    {
        changFen.cooking();
    }
    public void chooseHunTun()
    {
        hunTun.cooking();
    }
    public void chooseHeFen()
    {
        heFen.cooking();
    }
}
//抽象命令：早餐
interface Breakfast
{
    public abstract void cooking();
}
//具体命令：肠粉
class ChangFen implements Breakfast
{
    private ChangFenChef receiver;
    ChangFen()
    {
        receiver=new ChangFenChef();
    }
    public void cooking()
    {       
        receiver.cooking();
    }
}
//具体命令：馄饨
class HunTun implements Breakfast
{
    private HunTunChef receiver;
    HunTun()
    {
        receiver=new HunTunChef();
    }
    public void cooking()
    {
        receiver.cooking();
    }
}
//具体命令：河粉
class HeFen implements Breakfast
{
    private HeFenChef receiver;
    HeFen()
    {
        receiver=new HeFenChef();
    }
    public void cooking()
    {
        receiver.cooking();
    }
}
//接收者：肠粉厨师
class ChangFenChef extends JFrame
{   
    private static final long serialVersionUID = 1L;
    JLabel l=new JLabel();
    ChangFenChef()
    {
        super("煮肠粉");
        l.setIcon(new ImageIcon("src/command/ChangFen.jpg"));
        this.add(l);
        this.setLocation(30, 30);
        this.pack();
        this.setResizable(false);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);   
    }
    public void cooking()
    {
        this.setVisible(true);
    }
}
//接收者：馄饨厨师
class HunTunChef extends JFrame
{
    private static final long serialVersionUID=1L;
    JLabel l=new JLabel();
    HunTunChef()
    {
        super("煮馄饨");
        l.setIcon(new ImageIcon("src/command/HunTun.jpg"));
        this.add(l);
        this.setLocation(350, 50);
        this.pack();
        this.setResizable(false);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);    
    }
    public void cooking()
    {
        this.setVisible(true);
    }
}
//接收者：河粉厨师
class HeFenChef extends JFrame
{
    private static final long serialVersionUID=1L;
    JLabel l=new JLabel();
    HeFenChef()
    {
        super("煮河粉");
        l.setIcon(new ImageIcon("src/command/HeFen.jpg"));
        this.add(l);
        this.setLocation(200, 280);
        this.pack();
        this.setResizable(false);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
    public void cooking()
    {
        this.setVisible(true);
    }
}
```

### 命令模式的应用场景
命令模式通常适用于以下场景。
- 1.当系统需要将请求调用者与请求接收者解耦时，命令模式使得调用者和接收者不直接交互。
- 2.当系统需要随机请求命令或经常增加或删除命令时，命令模式比较方便实现这些功能。
- 3.当系统需要执行一组操作时，命令模式可以定义宏命令来实现该功能。
- 4.当系统需要支持命令的撤销（Undo）操作和恢复（Redo）操作时，可以将命令对象存储起来，采用备忘录模式来实现。
### 命令模式的扩展
在软件开发中，有时将命令模式与前面学的组合模式联合使用，这就构成了宏命令模式，也叫组合命令模式。宏命令包含了一组命令，它充当了具体命令与调用者的双重角色，执行它时将递归调用它所包含的所有命令，其具体结构图如图 3 所示。
<br/>
![](/images/design/60.gif)
<br/>
图3 组合命令模式的结构图
<br/>
程序代码如下：
```java
package command;
import java.util.ArrayList;
public class CompositeCommandPattern
{
    public static void main(String[] args)
    {
        AbstractCommand cmd1=new ConcreteCommand1();
        AbstractCommand cmd2=new ConcreteCommand2();
        CompositeInvoker ir=new CompositeInvoker();
        ir.add(cmd1);
        ir.add(cmd2);
        System.out.println("客户访问调用者的execute()方法...");
        ir.execute();
    }
}
//抽象命令
interface AbstractCommand
{
    public abstract void execute();
}
//树叶构件: 具体命令1
class ConcreteCommand1 implements AbstractCommand
{
    private CompositeReceiver receiver;
    ConcreteCommand1()
    {
        receiver=new CompositeReceiver();
    }
    public void execute()
    {       
        receiver.action1();
    }
}
//树叶构件: 具体命令2
class ConcreteCommand2 implements AbstractCommand
{
    private CompositeReceiver receiver;
    ConcreteCommand2()
    {
        receiver=new CompositeReceiver();
    }
    public void execute()
    {       
        receiver.action2();
    }
}
//树枝构件: 调用者
class CompositeInvoker implements AbstractCommand
{
    private ArrayList<AbstractCommand> children = new ArrayList<AbstractCommand>();   
    public void add(AbstractCommand c)
    {
        children.add(c);
    }   
    public void remove(AbstractCommand c)
    {
        children.remove(c);
    }   
    public AbstractCommand getChild(int i)
    {
        return children.get(i);
    }   
    public void execute()
    {
        for(Object obj:children)
        {
            ((AbstractCommand)obj).execute();
        }
    }    
}
//接收者
class CompositeReceiver
{
    public void action1()
    {
        System.out.println("接收者的action1()方法被调用...");
    }
    public void action2()
    {
        System.out.println("接收者的action2()方法被调用...");
    }
}
```
```info
程序的运行结果如下：
客户访问调用者的execute()方法...
接收者的action1()方法被调用...
接收者的action2()方法被调用...
```
当然，命令模式还可以同备忘录（Memento）模式组合使用，这样就变成了可撤销的命令模式，这将在后面介绍。

## 16.责任链模式（职责链模式）详解
在现实生活中，常常会出现这样的事例：一个请求有多个对象可以处理，但每个对象的处理条件或权限不同。例如，公司员工请假，可批假的领导有部门负责人、副总经理、总经理等，但每个领导能批准的天数不同，员工必须根据自己要请假的天数去找不同的领导签名，也就是说员工必须记住每个领导的姓名、电话和地址等信息，这增加了难度。这样的例子还有很多，如找领导出差报销、生活中的“击鼓传花”游戏等。
<br/>
在计算机软硬件中也有相关例子，如总线网中数据报传送，每台计算机根据目标地址是否同自己的地址相同来决定是否接收；还有异常处理中，处理程序根据异常的类型决定自己是否处理该异常；还有 Struts2 的拦截器、JSP 和 Servlet 的 Filter 等，所有这些，如果用责任链模式都能很好解决。
<br/>
### 模式的定义与特点
责任链（Chain of Responsibility）模式的定义：为了避免请求发送者与多个请求处理者耦合在一起，将所有请求的处理者通过前一对象记住其下一个对象的引用而连成一条链；当有请求发生时，可将请求沿着这条链传递，直到有对象处理它为止。
<br/>
:::tip 注意
注意：责任链模式也叫职责链模式。
:::
在责任链模式中，客户只需要将请求发送到责任链上即可，无须关心请求的处理细节和请求的传递过程，所以责任链将请求的发送者和请求的处理者解耦了。
<br/>
责任链模式是一种对象行为型模式，其主要优点如下。
- 1.降低了对象之间的耦合度。该模式使得一个对象无须知道到底是哪一个对象处理其请求以及链的结构，发送者和接收者也无须拥有对方的明确信息。
- 2.增强了系统的可扩展性。可以根据需要增加新的请求处理类，满足开闭原则。
- 3.增强了给对象指派职责的灵活性。当工作流程发生变化，可以动态地改变链内的成员或者调动它们的次序，也可动态地新增或者删除责任。
- 4.责任链简化了对象之间的连接。每个对象只需保持一个指向其后继者的引用，不需保持其他所有处理者的引用，这避免了使用众多的 if 或者 if···else 语句。
- 5.责任分担。每个类只需要处理自己该处理的工作，不该处理的传递给下一个对象完成，明确各类的责任范围，符合类的单一职责原则。

<br/>
其主要缺点如下。
- 1.不能保证每个请求一定被处理。由于一个请求没有明确的接收者，所以不能保证它一定会被处理，该请求可能一直传到链的末端都得不到处理。
- 2.对比较长的职责链，请求的处理可能涉及多个处理对象，系统性能将受到一定影响。
- 3.职责链建立的合理性要靠客户端来保证，增加了客户端的复杂性，可能会由于职责链的错误设置而导致系统出错，如可能会造成循环调用。
<br/>

### 模式的结构与实现
通常情况下，可以通过数据链表来实现职责链模式的[数据结构](http://c.biancheng.net/data_structure/)。
#### 1. 模式的结构
职责链模式主要包含以下角色。
- 1.抽象处理者（Handler）角色：定义一个处理请求的接口，包含抽象处理方法和一个后继连接。
- 2.具体处理者（Concrete Handler）角色：实现抽象处理者的处理方法，判断能否处理本次请求，如果可以处理请求则处理，否则将该请求转给它的后继者。
- 3.客户类（Client）角色：创建处理链，并向链头的具体处理者对象提交请求，它不关心处理细节和请求的传递过程。
<br/>
其结构图如图 1 所示。客户端可按图 2 所示设置责任链。
<br/>
![](/images/design/61.gif)
<br/>
图1 责任链模式的结构图
<br/>
![](/images/design/62.gif)
<br/>
图2 责任链
<br/>
#### 2. 模式的实现
职责链模式的实现代码如下：
```java
package chainOfResponsibility;
public class ChainOfResponsibilityPattern
{
    public static void main(String[] args)
    {
        //组装责任链 
        Handler handler1=new ConcreteHandler1(); 
        Handler handler2=new ConcreteHandler2(); 
        handler1.setNext(handler2); 
        //提交请求 
        handler1.handleRequest("two");
    }
}
//抽象处理者角色
abstract class Handler
{
    private Handler next;
    public void setNext(Handler next)
    {
        this.next=next; 
    }
    public Handler getNext()
    { 
        return next; 
    }   
    //处理请求的方法
    public abstract void handleRequest(String request);       
}
//具体处理者角色1
class ConcreteHandler1 extends Handler
{
    public void handleRequest(String request)
    {
        if(request.equals("one")) 
        {
            System.out.println("具体处理者1负责处理该请求！");       
        }
        else
        {
            if(getNext()!=null) 
            {
                getNext().handleRequest(request);             
            }
            else
            {
                System.out.println("没有人处理该请求！");
            }
        } 
    } 
}
//具体处理者角色2
class ConcreteHandler2 extends Handler
{
    public void handleRequest(String request)
    {
        if(request.equals("two")) 
        {
            System.out.println("具体处理者2负责处理该请求！");       
        }
        else
        {
            if(getNext()!=null) 
            {
                getNext().handleRequest(request);             
            }
            else
            {
                System.out.println("没有人处理该请求！");
            }
        } 
    }
}
```
### 模式的应用实例
#### 【例1】用责任链模式设计一个请假条审批模块。
分析：假如规定学生请假小于或等于 2 天，班主任可以批准；小于或等于 7 天，系主任可以批准；小于或等于 10 天，院长可以批准；其他情况不予批准；这个实例适合使用职责链模式实现。
<br/>
首先，定义一个领导类（Leader），它是抽象处理者，包含了一个指向下一位领导的指针 next 和一个处理假条的抽象处理方法 handleRequest(int LeaveDays)；然后，定义班主任类（ClassAdviser）、系主任类（DepartmentHead）和院长类（Dean），它们是抽象处理者的子类，是具体处理者，必须根据自己的权力去实现父类的 handleRequest(int LeaveDays) 方法，如果无权处理就将假条交给下一位具体处理者，直到最后；客户类负责创建处理链，并将假条交给链头的具体处理者（班主任）。图 3 所示是其结构图。
<br/>
![](/images/design/63.gif)
<br/>
图3 请假条审批模块的结构图
<br/>
```java
package chainOfResponsibility;
public class LeaveApprovalTest
{
    public static void main(String[] args)
    {
        //组装责任链 
        Leader teacher1=new ClassAdviser();
        Leader teacher2=new DepartmentHead();
        Leader teacher3=new Dean();
        //Leader teacher4=new DeanOfStudies();
        teacher1.setNext(teacher2);
        teacher2.setNext(teacher3);
        //teacher3.setNext(teacher4);
        //提交请求 
        teacher1.handleRequest(8);
    }
}
//抽象处理者：领导类
abstract class Leader
{
    private Leader next;
    public void setNext(Leader next)
    {
        this.next=next; 
    }
    public Leader getNext()
    { 
        return next; 
    }   
    //处理请求的方法
    public abstract void handleRequest(int LeaveDays);       
}
//具体处理者1：班主任类
class ClassAdviser extends Leader
{
    public void handleRequest(int LeaveDays)
    {
        if(LeaveDays<=2) 
        {
            System.out.println("班主任批准您请假" + LeaveDays + "天。");       
        }
        else
        {
            if(getNext() != null) 
            {
                getNext().handleRequest(LeaveDays);             
            }
            else
            {
                  System.out.println("请假天数太多，没有人批准该假条！");
            }
        } 
    } 
}
//具体处理者2：系主任类
class DepartmentHead extends Leader
{
    public void handleRequest(int LeaveDays)
    {
        if(LeaveDays<=7) 
        {
            System.out.println("系主任批准您请假" + LeaveDays + "天。");       
        }
        else
        {
            if(getNext() != null) 
            {
                  getNext().handleRequest(LeaveDays);             
            }
            else
            {
                System.out.println("请假天数太多，没有人批准该假条！");
           }
        } 
    } 
}
//具体处理者3：院长类
class Dean extends Leader
{
    public void handleRequest(int LeaveDays)
    {
        if(LeaveDays<=10) 
        {
            System.out.println("院长批准您请假" + LeaveDays + "天。");       
        }
        else
        {
              if(getNext() != null) 
            {
                getNext().handleRequest(LeaveDays);             
            }
            else
            {
                  System.out.println("请假天数太多，没有人批准该假条！");
            }
        } 
    } 
}
//具体处理者4：教务处长类
class DeanOfStudies extends Leader
{
    public void handleRequest(int LeaveDays)
    {
        if(LeaveDays<=20) 
        {
            System.out.println("教务处长批准您请假"+LeaveDays+"天。");       
        }
        else
        {
              if(getNext()!=null) 
            {
                getNext().handleRequest(LeaveDays);          
            }
            else
            {
                  System.out.println("请假天数太多，没有人批准该假条！");
            }
        } 
    } 
}
```
### 模式的应用场景
前边已经讲述了关于责任链模式的结构与特点，下面介绍其应用场景，责任链模式通常在以下几种情况使用。
- 1.有多个对象可以处理一个请求，哪个对象处理该请求由运行时刻自动确定。
- 2.可动态指定一组对象处理请求，或添加新的处理者。
- 3.在不明确指定请求处理者的情况下，向多个处理者中的一个提交请求。
### 模式的扩展
职责链模式存在以下两种情况。
- 1.纯的职责链模式：一个请求必须被某一个处理者对象所接收，且一个具体处理者对某个请求的处理只能采用以下两种行为之一：自己处理（承担责任）；把责任推给下家处理。
- 2.不纯的职责链模式：允许出现某一个具体处理者对象在承担了请求的一部分责任后又将剩余的责任传给下家的情况，且一个请求可以最终不被任何接收端对象所接收。

## 17.状态模式（详解版）
在软件开发过程中，应用程序中的有些对象可能会根据不同的情况做出不同的行为，我们把这种对象称为有状态的对象，而把影响对象行为的一个或多个动态变化的属性称为状态。当有状态的对象与外部事件产生互动时，其内部状态会发生改变，从而使得其行为也随之发生改变。如人的情绪有高兴的时候和伤心的时候，不同的情绪有不同的行为，当然外界也会影响其情绪变化。
<br/>
对这种有状态的对象编程，传统的解决方案是：将这些所有可能发生的情况全都考虑到，然后使用 if-else 语句来做状态判断，再进行不同情况的处理。但当对象的状态很多时，程序会变得很复杂。而且增加新的状态要添加新的 if-else 语句，这违背了“开闭原则”，不利于程序的扩展。
<br/>
以上问题如果采用“状态模式”就能很好地得到解决。状态模式的解决思想是：当控制一个对象状态转换的条件表达式过于复杂时，把相关“判断逻辑”提取出来，放到一系列的状态类当中，这样可以把原来复杂的逻辑判断简单化。
<br/>
### 状态模式的定义与特点
状态（State）模式的定义：对有状态的对象，把复杂的“判断逻辑”提取到不同的状态对象中，允许状态对象在其内部状态发生改变时改变其行为。
<br/>
状态模式是一种对象行为型模式，其主要优点如下。
- 1.状态模式将与特定状态相关的行为局部化到一个状态中，并且将不同状态的行为分割开来，满足“单一职责原则”。
- 2.减少对象间的相互依赖。将不同的状态引入独立的对象中会使得状态转换变得更加明确，且减少对象间的相互依赖。
- 3.有利于程序的扩展。通过定义新的子类很容易地增加新的状态和转换。
<br/>
状态模式的主要缺点如下。
- 1.状态模式的使用必然会增加系统的类与对象的个数。
- 2.状态模式的结构与实现都较为复杂，如果使用不当会导致程序结构和代码的混乱。
### 状态模式的结构与实现
状态模式把受环境改变的对象行为包装在不同的状态对象里，其意图是让一个对象在其内部状态改变的时候，其行为也随之改变。现在我们来分析其基本结构和实现方法。
#### 1. 模式的结构
状态模式包含以下主要角色。
- 1.环境（Context）角色：也称为上下文，它定义了客户感兴趣的接口，维护一个当前状态，并将与状态相关的操作委托给当前状态对象来处理。
- 2.抽象状态（State）角色：定义一个接口，用以封装环境对象中的特定状态所对应的行为。
- 3.具体状态（Concrete    State）角色：实现抽象状态所对应的行为。
<br/>
其结构图如图 1 所示。
<br/>
![](/images/design/64.gif)
<br/>
图1 状态模式的结构图
#### 2. 模式的实现
状态模式的实现代码如下：
```java
package state;
public class StatePatternClient
{
    public static void main(String[] args)
    {       
        Context context=new Context();    //创建环境       
        context.Handle();    //处理请求
        context.Handle();
        context.Handle();
        context.Handle();
    }
}
//环境类
class Context
{
    private State state;
    //定义环境类的初始状态
    public Context()
    {
        this.state=new ConcreteStateA();
    }
    //设置新状态
    public void setState(State state)
    {
        this.state=state;
    }
    //读取状态
    public State getState()
    {
        return(state);
    }
    //对请求做处理
    public void Handle()
    {
        state.Handle(this);
    }
}
//抽象状态类
abstract class State
{
    public abstract void Handle(Context context);
}
//具体状态A类
class ConcreteStateA extends State
{
    public void Handle(Context context)
    {
        System.out.println("当前状态是 A.");
        context.setState(new ConcreteStateB());
    }
}
//具体状态B类
class ConcreteStateB extends State
{
    public void Handle(Context context)
    {
        System.out.println("当前状态是 B.");
        context.setState(new ConcreteStateA());
    }
}
```
### 状态模式的应用实例
#### 【例1】用“状态模式”设计一个学生成绩的状态转换程序。
分析：本实例包含了“不及格”“中等”和“优秀” 3 种状态，当学生的分数小于 60 分时为“不及格”状态，当分数大于等于 60 分且小于 90 分时为“中等”状态，当分数大于等于 90 分时为“优秀”状态，我们用状态模式来实现这个程序。
<br/>
首先，定义一个抽象状态类（AbstractState），其中包含了环境属性、状态名属性和当前分数属性，以及加减分方法 addScore(intx) 和检查当前状态的抽象方法 checkState()；然后，定义“不及格”状态类 LowState、“中等”状态类 MiddleState 和“优秀”状态类 HighState，它们是具体状态类，实现 checkState() 方法，负责检査自己的状态，并根据情况转换；最后，定义环境类（ScoreContext），其中包含了当前状态对象和加减分的方法 add(int score)，客户类通过该方法来改变成绩状态。图 2 所示是其结构图。
<br/>
![](/images/design/65.gif)
<br/>
图2 学生成绩的状态转换程序的结构图
<br/>
程序代码如下：
```java
package state;
public class ScoreStateTest
{
    public static void main(String[] args)
    {
        ScoreContext account=new ScoreContext();
        System.out.println("学生成绩状态测试：");
        account.add(30);
        account.add(40);
        account.add(25);
        account.add(-15);
        account.add(-25);
    }
}
//环境类
class ScoreContext
{
    private AbstractState state;
    ScoreContext()
    {
        state=new LowState(this);
    }
    public void setState(AbstractState state)
    {
        this.state=state;
    }
    public AbstractState getState()
    {
        return state;
    }   
    public void add(int score)
    {
        state.addScore(score);
    }
}
//抽象状态类
abstract class AbstractState
{
    protected ScoreContext hj;  //环境
    protected String stateName; //状态名
    protected int score; //分数
    public abstract void checkState(); //检查当前状态
    public void addScore(int x)
    {
        score+=x;       
        System.out.print("加上："+x+"分，\t当前分数："+score );
        checkState();
        System.out.println("分，\t当前状态："+hj.getState().stateName);
    }   
}
//具体状态类：不及格
class LowState extends AbstractState
{
    public LowState(ScoreContext h)
    {
        hj=h;
        stateName="不及格";
        score=0;
    }
    public LowState(AbstractState state)
    {
        hj=state.hj;
        stateName="不及格";
        score=state.score;
    }
    public void checkState()
    {
        if(score>=90)
        {
            hj.setState(new HighState(this));
        }
        else if(score>=60)
        {
            hj.setState(new MiddleState(this));
        }
    }   
}
//具体状态类：中等
class MiddleState extends AbstractState
{
    public MiddleState(AbstractState state)
    {
        hj=state.hj;
        stateName="中等";
        score=state.score;
    }
    public void checkState()
    {
        if(score<60)
        {
            hj.setState(new LowState(this));
        }
        else if(score>=90)
        {
            hj.setState(new HighState(this));
        }
    }
}
//具体状态类：优秀
class HighState extends AbstractState
{
    public HighState(AbstractState state)
    {
        hj=state.hj;
        stateName="优秀";
        score=state.score;
    }           
    public void checkState()
    {
        if(score<60)
        {
            hj.setState(new LowState(this));
        }
        else if(score<90)
        {
            hj.setState(new MiddleState(this));
        }
    }
}
```

#### 【例2】用“状态模式”设计一个多线程的状态转换程序。
分析：多线程存在 5 种状态，分别为新建状态、就绪状态、运行状态、阻塞状态和死亡状态，各个状态当遇到相关方法调用或事件触发时会转换到其他状态，其状态转换规律如图 3 所示。
<br/>
![](/images/design/66.gif)
<br/>
图3 线程状态转换图
<br/>
现在先定义一个抽象状态类（TheadState），然后为图 3 所示的每个状态设计一个具体状态类，它们是新建状态（New）、就绪状态（Runnable ）、运行状态（Running）、阻塞状态（Blocked）和死亡状态（Dead），每个状态中有触发它们转变状态的方法，环境类（ThreadContext）中先生成一个初始状态（New），并提供相关触发方法，图 4 所示是线程状态转换程序的结构图。
<br/>
![](/images/design/67.gif)
<br/>
图4 线程状态转换程序的结构图
<br/>

### 状态模式的应用场景
通常在以下情况下可以考虑使用状态模式。
- 1.当一个对象的行为取决于它的状态，并且它必须在运行时根据状态改变它的行为时，就可以考虑使用状态模式。
- 2.一个操作中含有庞大的分支结构，并且这些分支决定于对象的状态时。
### 状态模式的扩展
在有些情况下，可能有多个环境对象需要共享一组状态，这时需要引入享元模式，将这些具体状态对象放在集合中供程序共享，其结构图如图 5 所示。
<br/>
![](/images/design/68.gif)
<br/>
图5 共享状态模式的结构图
<br/>
分析：共享状态模式的不同之处是在环境类中增加了一个 HashMap 来保存相关状态，当需要某种状态时可以从中获取，其程序代码如下：
<br/>
```java
package state;
import java.util.HashMap;
public class FlyweightStatePattern
{
    public static void main(String[] args)
    {
        ShareContext context=new ShareContext(); //创建环境       
        context.Handle(); //处理请求
        context.Handle();
        context.Handle();
        context.Handle();
    }
}
//环境类
class ShareContext
{
    private ShareState state;
    private HashMap<String, ShareState> stateSet=new HashMap<String, ShareState>();
    public ShareContext()
    {
        state=new ConcreteState1();
        stateSet.put("1", state);
        state=new ConcreteState2();
        stateSet.put("2", state);
        state=getState("1");
    }
    //设置新状态
    public void setState(ShareState state)
    {
        this.state=state;
    }
    //读取状态
    public ShareState getState(String key)
    {
        ShareState s=(ShareState)stateSet.get(key);
        return s;
    }
    //对请求做处理
    public void Handle()
    {
        state.Handle(this);
    }
}
//抽象状态类
abstract class ShareState
{
    public abstract void Handle(ShareContext context);
}
//具体状态1类
class ConcreteState1 extends ShareState
{
    public void Handle(ShareContext context)
    {
        System.out.println("当前状态是： 状态1");
        context.setState(context.getState("2"));
    }
}
//具体状态2类
class ConcreteState2 extends ShareState
{
    public void Handle(ShareContext context)
    {
        System.out.println("当前状态是： 状态2");
        context.setState(context.getState("1"));
    }
}
```

## 18.观察者模式（Observer模式）详解
在现实世界中，许多对象并不是独立存在的，其中一个对象的行为发生改变可能会导致一个或者多个其他对象的行为也发生改变。例如，某种商品的物价上涨时会导致部分商家高兴，而消费者伤心；还有，当我们开车到交叉路口时，遇到红灯会停，遇到绿灯会行。这样的例子还有很多，例如，股票价格与股民、微信公众号与微信用户、气象局的天气预报与听众、小偷与警察等。
<br/>
在软件世界也是这样，例如，Excel 中的数据与折线图、饼状图、柱状图之间的关系；MVC 模式中的模型与视图的关系；事件模型中的事件源与事件处理者。所有这些，如果用观察者模式来实现就非常方便。
<br/>
### 模式的定义与特点
观察者（Observer）模式的定义：指多个对象间存在一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。这种模式有时又称作发布-订阅模式、模型-视图模式，它是对象行为型模式。
<br/>
观察者模式是一种对象行为型模式，其主要优点如下。
- 1.降低了目标与观察者之间的耦合关系，两者之间是抽象耦合关系。
- 2.目标与观察者之间建立了一套触发机制。
<br/>
它的主要缺点如下。
- 1.目标与观察者之间的依赖关系并没有完全解除，而且有可能出现循环引用。
- 2.当观察者对象很多时，通知的发布会花费很多时间，影响程序的效率。

### 模式的结构与实现
实现观察者模式时要注意具体目标对象和具体观察者对象之间不能直接调用，否则将使两者之间紧密耦合起来，这违反了面向对象的设计原则。
<br/>
#### 1. 模式的结构
观察者模式的主要角色如下。
- 1.抽象主题（Subject）角色：也叫抽象目标类，它提供了一个用于保存观察者对象的聚集类和增加、删除观察者对象的方法，以及通知所有观察者的抽象方法。
- 2.具体主题（Concrete    Subject）角色：也叫具体目标类，它实现抽象目标中的通知方法，当具体主题的内部状态发生改变时，通知所有注册过的观察者对象。
- 3.抽象观察者（Observer）角色：它是一个抽象类或接口，它包含了一个更新自己的抽象方法，当接到具体主题的更改通知时被调用。
- 4.具体观察者（Concrete Observer）角色：实现抽象观察者中定义的抽象方法，以便在得到目标的更改通知时更新自身的状态。
<br/>
观察者模式的结构图如图 1 所示。
![](/images/design/69.gif)
<br/>
图1 观察者模式的结构图
<br/>
#### 2. 模式的实现
观察者模式的实现代码如下：
```java
package observer;
import java.util.*;
public class ObserverPattern
{
    public static void main(String[] args)
    {
        Subject subject=new ConcreteSubject();
        Observer obs1=new ConcreteObserver1();
        Observer obs2=new ConcreteObserver2();
        subject.add(obs1);
        subject.add(obs2);
        subject.notifyObserver();
    }
}
//抽象目标
abstract class Subject
{
    protected List<Observer> observers=new ArrayList<Observer>();   
    //增加观察者方法
    public void add(Observer observer)
    {
        observers.add(observer);
    }    
    //删除观察者方法
    public void remove(Observer observer)
    {
        observers.remove(observer);
    }   
    public abstract void notifyObserver(); //通知观察者方法
}
//具体目标
class ConcreteSubject extends Subject
{
    public void notifyObserver()
    {
        System.out.println("具体目标发生改变...");
        System.out.println("--------------");       
       
        for(Object obs:observers)
        {
            ((Observer)obs).response();
        }
       
    }          
}
//抽象观察者
interface Observer
{
    void response(); //反应
}
//具体观察者1
class ConcreteObserver1 implements Observer
{
    public void response()
    {
        System.out.println("具体观察者1作出反应！");
    }
}
//具体观察者1
class ConcreteObserver2 implements Observer
{
    public void response()
    {
        System.out.println("具体观察者2作出反应！");
    }
}
```

### 模式的应用实例
#### 【例1】利用观察者模式设计一个程序，分析“人民币汇率”的升值或贬值对进口公司的进口产品成本或出口公司的出口产品收入以及公司的利润率的影响。
分析：当“人民币汇率”升值时，进口公司的进口产品成本降低且利润率提升，出口公司的出口产品收入降低且利润率降低；当“人民币汇率”贬值时，进口公司的进口产品成本提升且利润率降低，出口公司的出口产品收入提升且利润率提升。
<br/>
这里的汇率（Rate）类是抽象目标类，它包含了保存观察者（Company）的 List 和增加/删除观察者的方法，以及有关汇率改变的抽象方法 change(int number)；而人民币汇率（RMBrate）类是具体目标， 它实现了父类的 change(int number) 方法，即当人民币汇率发生改变时通过相关公司；公司（Company）类是抽象观察者，它定义了一个有关汇率反应的抽象方法 response(int number)；进口公司（ImportCompany）类和出口公司（ExportCompany）类是具体观察者类，它们实现了父类的 response(int number) 方法，即当它们接收到汇率发生改变的通知时作为相应的反应。图 2 所示是其结构图。
<br/>
![](/images/design/70.gif)
<br/>
图2 人民币汇率分析程序的结构图
<br/>
```java
package observer;
import java.util.*;
public class RMBrateTest
{
    public static void main(String[] args)
    {
        Rate rate=new RMBrate();         
        Company watcher1=new ImportCompany(); 
        Company watcher2=new ExportCompany();           
        rate.add(watcher1); 
        rate.add(watcher2);           
        rate.change(10);
        rate.change(-9);
    }
}
//抽象目标：汇率
abstract class Rate
{
    protected List<Company> companys=new ArrayList<Company>();   
    //增加观察者方法
    public void add(Company company)
    {
        companys.add(company);
    }    
    //删除观察者方法
    public void remove(Company company)
    {
        companys.remove(company);
    }   
    public abstract void change(int number);
}
//具体目标：人民币汇率
class RMBrate extends Rate 
{
    public void change(int number)
    {       
        for(Company obs:companys)
        {
            ((Company)obs).response(number);
        }       
    }
}
//抽象观察者：公司
interface Company
{
    void response(int number);
}
//具体观察者1：进口公司 
class ImportCompany implements Company 
{
    public void response(int number) 
    {
        if(number>0)
        {
            System.out.println("人民币汇率升值"+number+"个基点，降低了进口产品成本，提升了进口公司利润率。"); 
        }
        else if(number<0)
        {
              System.out.println("人民币汇率贬值"+(-number)+"个基点，提升了进口产品成本，降低了进口公司利润率。"); 
        }
    } 
} 
//具体观察者2：出口公司
class ExportCompany implements Company 
{
    public void response(int number) 
    {
        if(number>0)
        {
            System.out.println("人民币汇率升值"+number+"个基点，降低了出口产品收入，降低了出口公司的销售利润率。"); 
        }
        else if(number<0)
        {
              System.out.println("人民币汇率贬值"+(-number)+"个基点，提升了出口产品收入，提升了出口公司的销售利润率。"); 
        }
    } 
}
```

#### 【例2】利用观察者模式设计一个学校铃声的事件处理程序。
分析：在本实例中，学校的“铃”是事件源和目标，“老师”和“学生”是事件监听器和具体观察者，“铃声”是事件类。学生和老师来到学校的教学区，都会注意学校的铃，这叫事件绑定；当上课时间或下课时间到，会触发铃发声，这时会生成“铃声”事件；学生和老师听到铃声会开始上课或下课，这叫事件处理。这个实例非常适合用观察者模式实现，图 3 给出了学校铃声的事件模型。
<br/>
![](/images/design/71.gif)
<br/>
图3 学校铃声的事件模型图
<br/>
现在用“观察者模式”来实现该事件处理模型。首先，定义一个铃声事件（RingEvent）类，它记录了铃声的类型（上课铃声/下课铃声）；再定义一个学校的铃（BellEventSource）类，它是事件源，是观察者目标类，该类里面包含了监听器容器 listener，可以绑定监听者（学生或老师），并且有产生铃声事件和通知所有监听者的方法；然后，定义一声事件监听者（BellEventListener）类，它是抽象观察者，它包含了铃声事件处理方法 heardBell(RingEvent e)；最后，定义老师类（TeachEventListener）和学生类（StuEventListener），它们是事件监听器，是具体观察者，听到铃声会去上课或下课。图 4 给出了学校铃声事件处理程序的结构。
<br/>
![](/images/design/72.gif)
<br/>
图4 学校铃声事件处理程序的结构图
<br/>
程序代码如下：
<br/>
```java
package observer;
import java.util.*;
public class BellEventTest
{
    public static void main(String[] args)
    {
        BellEventSource bell=new BellEventSource();    //铃（事件源）    
        bell.addPersonListener(new TeachEventListener()); //注册监听器（老师）
        bell.addPersonListener(new StuEventListener());    //注册监听器（学生）
        bell.ring(true);   //打上课铃声
        System.out.println("------------");   
        bell.ring(false);  //打下课铃声
    }
}
//铃声事件类：用于封装事件源及一些与事件相关的参数
class RingEvent extends EventObject
{   
    private static final long serialVersionUID=1L;
    private boolean sound;    //true表示上课铃声,false表示下课铃声
    public RingEvent(Object source,boolean sound)
    {
        super(source);
        this.sound=sound;
    }   
    public void setSound(boolean sound)
    {
        this.sound=sound;
    }
    public boolean getSound()
    {
        return this.sound;
    }
}
//目标类：事件源，铃
class BellEventSource
{    
    private List<BellEventListener> listener; //监听器容器
    public BellEventSource()
    { 
        listener=new ArrayList<BellEventListener>();        
    }
    //给事件源绑定监听器 
    public void addPersonListener(BellEventListener ren)
    { 
        listener.add(ren); 
    }
    //事件触发器：敲钟，当铃声sound的值发生变化时，触发事件。
    public void ring(boolean sound)
    {
        String type=sound?"上课铃":"下课铃";
        System.out.println(type+"响！");
        RingEvent event=new RingEvent(this, sound);     
        notifies(event);    //通知注册在该事件源上的所有监听器                
    }   
    //当事件发生时,通知绑定在该事件源上的所有监听器做出反应（调用事件处理方法）
    protected void notifies(RingEvent e)
    { 
        BellEventListener ren=null; 
        Iterator<BellEventListener> iterator=listener.iterator(); 
        while(iterator.hasNext())
        { 
            ren=iterator.next(); 
            ren.heardBell(e); 
        } 
    }
}
//抽象观察者类：铃声事件监听器
interface  BellEventListener extends EventListener
{
    //事件处理方法，听到铃声
    public void heardBell(RingEvent e);
}
//具体观察者类：老师事件监听器
class TeachEventListener implements BellEventListener
{
    public void heardBell(RingEvent e)
    {        
        if(e.getSound())
        {
            System.out.println("老师上课了...");           
        }
        else
        {
            System.out.println("老师下课了...");   
        }          
    }
}
//具体观察者类：学生事件监听器
class StuEventListener implements BellEventListener
{
    public void heardBell(RingEvent e)
    {        
        if(e.getSound())
        {
            System.out.println("同学们，上课了...");           
        }
        else
        {
            System.out.println("同学们，下课了...");   
        }          
    }
}
```
### 模式的应用场景
通过前面的分析与应用实例可知观察者模式适合以下几种情形。
- 1.对象间存在一对多关系，一个对象的状态发生改变会影响其他对象。
- 2.当一个抽象模型有两个方面，其中一个方面依赖于另一方面时，可将这二者封装在独立的对象中以使它们可以各自独立地改变和复用。


### 模式的扩展
在 Java 中，通过 java.util.Observable 类和 java.util.Observer 接口定义了观察者模式，只要实现它们的子类就可以编写观察者模式实例。
<br/>
#### 1. Observable类
Observable 类是抽象目标类，它有一个 Vector 向量，用于保存所有要通知的观察者对象，下面来介绍它最重要的 3 个方法。
- 1.void addObserver(Observer o) 方法：用于将新的观察者对象添加到向量中。
- 2.void notifyObservers(Object arg) 方法：调用向量中的所有观察者对象的 update。方法，通知它们数据发生改变。通常越晚加入向量的观察者越先得到通知。
- 3.void setChange() 方法：用来设置一个 boolean 类型的内部标志位，注明目标对象发生了变化。当它为真时，notifyObservers() 才会通知观察者。

#### 2. Observer 接口
Observer 接口是抽象观察者，它监视目标对象的变化，当目标对象发生变化时，观察者得到通知，并调用 void update(Observable o,Object arg) 方法，进行相应的工作。
<br/>
#### 【例3】利用 Observable 类和 Observer 接口实现原油期货的观察者模式实例。
分析：当原油价格上涨时，空方伤心，多方局兴；当油价下跌时，空方局兴，多方伤心。本实例中的抽象目标（Observable)类在 Java 中已经定义，可以直接定义其子类，即原油期货（OilFutures)类，它是具体目标类，该类中定义一个 SetPriCe(float price) 方法，当原油数据发生变化时调用其父类的 notifyObservers(Object arg) 方法来通知所有观察者；另外，本实例中的抽象观察者接口（Observer）在 Java 中已经定义，只要定义其子类，即具体观察者类（包括多方类 Bull 和空方类 Bear），并实现 update(Observable o,Object arg) 方法即可。图 5 所示是其结构图。
<br/>
![](/images/design/73.gif)
<br/>
图5 原油期货的观察者模式实例的结构图
```java
package observer;
import java.util.Observer;
import java.util.Observable;
public class CrudeOilFutures
{
    public static void main(String[] args)
    {
        OilFutures oil=new OilFutures();
        Observer bull=new Bull(); //多方
        Observer bear=new Bear(); //空方
        oil.addObserver(bull);
        oil.addObserver(bear);
        oil.setPrice(10);
        oil.setPrice(-8);
    }
}
//具体目标类：原油期货
class OilFutures extends Observable
{
    private float price;   
    public float getPrice()
    {
        return this.price; 
    }
    public void setPrice(float price)
    {
        super.setChanged() ;  //设置内部标志位，注明数据发生变化 
        super.notifyObservers(price);    //通知观察者价格改变了 
        this.price=price ; 
    }
}
//具体观察者类：多方
class Bull implements Observer
{   
    public void update(Observable o,Object arg)
    {
        Float price=((Float)arg).floatValue();
        if(price>0)
        {
            System.out.println("油价上涨"+price+"元，多方高兴了！");
        }
        else
        {
            System.out.println("油价下跌"+(-price)+"元，多方伤心了！");
        }
    }
}
//具体观察者类：空方
class Bear implements Observer
{   
    public void update(Observable o,Object arg)
    {
        Float price=((Float)arg).floatValue();
        if(price>0)
        {
            System.out.println("油价上涨"+price+"元，空方伤心了！");
        }
        else
        {
            System.out.println("油价下跌"+(-price)+"元，空方高兴了！");
        }
    }
}
```

## 19.中介者模式（详解版）
在现实生活中，常常会出现好多对象之间存在复杂的交互关系，这种交互关系常常是“网状结构”，它要求每个对象都必须知道它需要交互的对象。例如，每个人必须记住他（她）所有朋友的电话；而且，朋友中如果有人的电话修改了，他（她）必须告诉其他所有的朋友修改，这叫作“牵一发而动全身”，非常复杂。
<br/>
如果把这种“网状结构”改为“星形结构”的话，将大大降低它们之间的“耦合性”，这时只要找一个“中介者”就可以了。如前面所说的“每个人必须记住所有朋友电话”的问题，只要在网上建立一个每个朋友都可以访问的“通信录”就解决了。这样的例子还有很多，例如，你刚刚参力口工作想租房，可以找“房屋中介”；或者，自己刚刚到一个陌生城市找工作，可以找“人才交流中心”帮忙。
<br/>
在软件的开发过程中，这样的例子也很多，例如，在 MVC 框架中，控制器（C）就是模型（M）和视图（V）的中介者；还有大家常用的 QQ 聊天程序的“中介者”是 QQ 服务器。所有这些，都可以采用“中介者模式”来实现，它将大大降低对象之间的耦合性，提高系统的灵活性。

### 模式的定义与特点
中介者（Mediator）模式的定义：定义一个中介对象来封装一系列对象之间的交互，使原有对象之间的耦合松散，且可以独立地改变它们之间的交互。中介者模式又叫调停模式，它是迪米特法则的典型应用。
<br/>
中介者模式是一种对象行为型模式，其主要优点如下。
- 1.降低了对象之间的耦合性，使得对象易于独立地被复用。
- 2.将对象间的一对多关联转变为一对一的关联，提高系统的灵活性，使得系统易于维护和扩展。
<br/>
其主要缺点是：当同事类太多时，中介者的职责将很大，它会变得复杂而庞大，以至于系统难以维护。

### 模式的结构与实现
中介者模式实现的关键是找出“中介者”，下面对它的结构和实现进行分析。
#### 1. 模式的结构
中介者模式包含以下主要角色。
- 1.抽象中介者（Mediator）角色：它是中介者的接口，提供了同事对象注册与转发同事对象信息的抽象方法。
- 2.具体中介者（ConcreteMediator）角色：实现中介者接口，定义一个 List 来管理同事对象，协调各个同事角色之间的交互关系，因此它依赖于同事角色。
- 3.抽象同事类（Colleague）角色：定义同事类的接口，保存中介者对象，提供同事对象交互的抽象方法，实现所有相互影响的同事类的公共功能。
- 4.具体同事类（Concrete Colleague）角色：是抽象同事类的实现者，当需要与其他同事对象交互时，由中介者对象负责后续的交互。
<br/>
中介者模式的结构图如图 1 所示
<br/>
![](/images/design/73.gif)
<br/>
图1 中介者模式的结构图
<br/>
### 2. 模式的实现
中介者模式的实现代码如下：
```java
package mediator;
import java.util.*;
public class MediatorPattern
{
    public static void main(String[] args)
    {
        Mediator md=new ConcreteMediator();
        Colleague c1,c2;
        c1=new ConcreteColleague1();
        c2=new ConcreteColleague2();
        md.register(c1);
        md.register(c2);
        c1.send();
        System.out.println("-------------");
        c2.send();
    }
}
//抽象中介者
abstract class Mediator
{
    public abstract void register(Colleague colleague);
    public abstract void relay(Colleague cl); //转发
}
//具体中介者
class ConcreteMediator extends Mediator
{
    private List<Colleague> colleagues=new ArrayList<Colleague>();
    public void register(Colleague colleague)
    {
        if(!colleagues.contains(colleague))
        {
            colleagues.add(colleague);
            colleague.setMedium(this);
        }
    }
    public void relay(Colleague cl)
    {
        for(Colleague ob:colleagues)
        {
            if(!ob.equals(cl))
            {
                ((Colleague)ob).receive();
            }   
        }
    }
}
//抽象同事类
abstract class Colleague
{
    protected Mediator mediator;
    public void setMedium(Mediator mediator)
    {
        this.mediator=mediator;
    }   
    public abstract void receive();   
    public abstract void send();
}
//具体同事类
class ConcreteColleague1 extends Colleague
{
    public void receive()
    {
        System.out.println("具体同事类1收到请求。");
    }   
    public void send()
    {
        System.out.println("具体同事类1发出请求。");
        mediator.relay(this); //请中介者转发
    }
}
//具体同事类
class ConcreteColleague2 extends Colleague
{
    public void receive()
    {
        System.out.println("具体同事类2收到请求。");
    }   
    public void send()
    {
        System.out.println("具体同事类2发出请求。");
        mediator.relay(this); //请中介者转发
    }
}
```

### 模式的应用实例
#### 用中介者模式编写一个“韶关房地产交流平台”程序。
说明：韶关房地产交流平台是“房地产中介公司”提供给“卖方客户”与“买方客户”进行信息交流的平台，比较适合用中介者模式来实现。
<br/>
首先，定义一个中介公司（Medium）接口，它是抽象中介者，它包含了客户注册方法 register(Customer member) 和信息转发方法 relay(String from,String ad)；再定义一个韶关房地产中介（EstateMedium）公司，它是具体中介者类，它包含了保存客户信息的 List 对象，并实现了中介公司中的抽象方法。
<br/>
然后，定义一个客户（Qistomer）类，它是抽象同事类，其中包含了中介者的对象，和发送信息的 send(String ad) 方法与接收信息的 receive(String from，Stringad) 方法的接口，由于本程序是窗体程序，所以本类继承 JPmme 类，并实现动作事件的处理方法 actionPerformed(ActionEvent e)。
<br/>
最后，定义卖方（Seller）类和买方（Buyer）类，它们是具体同事类，是客户（Customer）类的子类，它们实现了父类中的抽象方法，通过中介者类进行信息交流，其结构图如图 2 所示。
<br/>
![](/images/design/75.gif)
<br/>
图2 韶关房地产交流平台的结构图
<br/>
```java
package mediator;
import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.event.*;
import java.util.*;
import javax.swing.*;
public class DatingPlatform
{
    public static void main(String[] args)
    {
        Medium md=new EstateMedium();    //房产中介
        Customer member1,member2;
        member1=new Seller("张三(卖方)");
        member2=new Buyer("李四(买方)");
        md.register(member1); //客户注册
        md.register(member2);
    }
}
//抽象中介者：中介公司
interface Medium
{
    void register(Customer member); //客户注册
    void relay(String from,String ad); //转发
}
//具体中介者：房地产中介
class EstateMedium implements Medium
{
    private List<Customer> members=new ArrayList<Customer>();   
    public void register(Customer member)
    {
        if(!members.contains(member))
        {
            members.add(member);
            member.setMedium(this);
        }
    }   
    public void relay(String from,String ad)
    {
        for(Customer ob:members)
        {
            String name=ob.getName();
            if(!name.equals(from))
            {
                ((Customer)ob).receive(from,ad);
            }   
        }
    }
}
//抽象同事类：客户
abstract class Customer extends JFrame implements  ActionListener
{
    private static final long serialVersionUID=-7219939540794786080L;
    protected Medium medium;
    protected String name;   
    JTextField SentText;
    JTextArea ReceiveArea;   
    public Customer(String name)
    {
        super(name);
        this.name=name;       
    }
    void ClientWindow(int x,int y)
    {       
        Container cp;        
        JScrollPane sp;
        JPanel p1,p2;        
        cp=this.getContentPane();       
        SentText=new JTextField(18);
        ReceiveArea=new JTextArea(10,18);
        ReceiveArea.setEditable(false);
        p1=new JPanel();
        p1.setBorder(BorderFactory.createTitledBorder("接收内容："));       
        p1.add(ReceiveArea);
        sp=new JScrollPane(p1);
        cp.add(sp,BorderLayout.NORTH);        
        p2=new JPanel();
        p2.setBorder(BorderFactory.createTitledBorder("发送内容："));       
        p2.add(SentText);   
        cp.add(p2,BorderLayout.SOUTH);       
        SentText.addActionListener(this);       
        this.setLocation(x,y);
        this.setSize(250, 330);
        this.setResizable(false); //窗口大小不可调整
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);      
        this.setVisible(true);       
    }
    public void actionPerformed(ActionEvent e)
    {
        String tempInfo=SentText.getText().trim();
        SentText.setText("");
        this.send(tempInfo);
    }
    public String getName()
    {    return name;   }
    public void setMedium(Medium medium)
    {      this.medium=medium;  }   
    public abstract void send(String ad);
    public abstract void receive(String from,String ad);
}
//具体同事类：卖方
class Seller extends Customer
{
    private static final long serialVersionUID=-1443076716629516027L;
    public Seller(String name)
    {
        super(name);
        ClientWindow(50,100);
    }   
    public void send(String ad)
    {
        ReceiveArea.append("我(卖方)说: "+ad+"\n");
        //使滚动条滚动到最底端
        ReceiveArea.setCaretPosition(ReceiveArea.getText().length());
        medium.relay(name,ad);
    }
    public void receive(String from,String ad)
    {
        ReceiveArea.append(from +"说: "+ad+"\n");
        //使滚动条滚动到最底端
        ReceiveArea.setCaretPosition(ReceiveArea.getText().length());
    }
}
//具体同事类：买方
class Buyer extends Customer
{
    private static final long serialVersionUID = -474879276076308825L;
    public Buyer(String name)
    {
        super(name);
        ClientWindow(350,100);
    }   
    public void send(String ad)
    {
        ReceiveArea.append("我(买方)说: "+ad+"\n");
        //使滚动条滚动到最底端
        ReceiveArea.setCaretPosition(ReceiveArea.getText().length());
        medium.relay(name,ad);
    }
    public void receive(String from,String ad)
    {
          ReceiveArea.append(from +"说: "+ad+"\n");
        //使滚动条滚动到最底端
        ReceiveArea.setCaretPosition(ReceiveArea.getText().length());
    }
}
```

### 模式的应用场景
前面分析了中介者模式的结构与特点，下面分析其以下应用场景。
- 1.当对象之间存在复杂的网状结构关系而导致依赖关系混乱且难以复用时。
- 2.当想创建一个运行于多个类之间的对象，又不想生成新的子类时。

### 模式的扩展
在实际开发中，通常采用以下两种方法来简化中介者模式，使开发变得更简单。
- 1.不定义中介者接口，把具体中介者对象实现成为单例。
- 2.同事对象不持有中介者，而是在需要的时直接获取中介者对象并调用。
<br/>
图 4 所示是简化中介者模式的结构图。
![](/images/design/76.gif)
图4 简化中介者模式的结构图
<br/>
```java
package mediator;
import java.util.*;
public class SimpleMediatorPattern
{
    public static void main(String[] args)
    {
        SimpleColleague c1,c2;
        c1=new SimpleConcreteColleague1();
        c2=new SimpleConcreteColleague2();
        c1.send();
        System.out.println("-----------------");
        c2.send();
    }
}
//简单单例中介者
class SimpleMediator
{
    private static SimpleMediator smd=new SimpleMediator();   
    private List<SimpleColleague> colleagues=new ArrayList<SimpleColleague>();   
    private SimpleMediator(){}   
    public static SimpleMediator getMedium()
    {    return(smd);   }
    public void register(SimpleColleague colleague)
    {
        if(!colleagues.contains(colleague))
        {
            colleagues.add(colleague);
        }
    }
    public void relay(SimpleColleague scl)
    {       
        for(SimpleColleague ob:colleagues)
        {
            if(!ob.equals(scl))
            {
                ((SimpleColleague)ob).receive();
            }   
        }
    }
}
//抽象同事类
interface SimpleColleague
{
    void receive();   
    void send();
}
//具体同事类
class SimpleConcreteColleague1 implements SimpleColleague
{
    SimpleConcreteColleague1(){
        SimpleMediator smd=SimpleMediator.getMedium();
        smd.register(this);
    }
    public void receive()
    {    System.out.println("具体同事类1：收到请求。");    }   
    public void send()
    {
        SimpleMediator smd=SimpleMediator.getMedium();
        System.out.println("具体同事类1：发出请求...");
        smd.relay(this); //请中介者转发
    }
}
//具体同事类
class SimpleConcreteColleague2 implements SimpleColleague
{
    SimpleConcreteColleague2(){
        SimpleMediator smd=SimpleMediator.getMedium();
        smd.register(this);
    }
    public void receive()
    {    System.out.println("具体同事类2：收到请求。");    }   
    public void send()
    {
        SimpleMediator smd=SimpleMediator.getMedium();
        System.out.println("具体同事类2：发出请求...");
        smd.relay(this); //请中介者转发
    }
}
```

## 20.迭代器模式（详解版）
在现实生活以及程序设计中，经常要访问一个聚合对象中的各个元素，如“[数据结构](http://c.biancheng.net/data_structure/)”中的链表遍历，通常的做法是将链表的创建和遍历都放在同一个类中，但这种方式不利于程序的扩展，如果要更换遍历方法就必须修改程序源代码，这违背了 “开闭原则”。
<br/>
既然将遍历方法封装在聚合类中不可取，那么聚合类中不提供遍历方法，将遍历方法由用户自己实现是否可行呢？答案是同样不可取，因为这种方式会存在两个缺点：
- 1.暴露了聚合类的内部表示，使其数据不安全；
- 2.增加了客户的负担。
<br/>
“迭代器模式”能较好地克服以上缺点，它在客户访问类与聚合类之间插入一个迭代器，这分离了聚合对象与其遍历行为，对客户也隐藏了其内部细节，且满足“单一职责原则”和“开闭原则”，如 Java 中的 Collection、List、Set、Map 等都包含了迭代器。
### 模式的定义与特点
迭代器（Iterator）模式的定义：提供一个对象来顺序访问聚合对象中的一系列数据，而不暴露聚合对象的内部表示。迭代器模式是一种对象行为型模式，其主要优点如下。
- 1.访问一个聚合对象的内容而无须暴露它的内部表示。
- 2.遍历任务交由迭代器完成，这简化了聚合类。
- 3.它支持以不同方式遍历一个聚合，甚至可以自定义迭代器的子类以支持新的遍历。
- 4.增加新的聚合类和迭代器类都很方便，无须修改原有代码。
- 5.封装性良好，为遍历不同的聚合结构提供一个统一的接口。
<br/>
其主要缺点是：增加了类的个数，这在一定程度上增加了系统的复杂性。
<br/>
### 模式的结构与实现
迭代器模式是通过将聚合对象的遍历行为分离出来，抽象成迭代器类来实现的，其目的是在不暴露聚合对象的内部结构的情况下，让外部代码透明地访问聚合的内部数据。现在我们来分析其基本结构与实现方法。
<br/>
#### 1. 模式的结构
迭代器模式主要包含以下角色。
- 1.抽象聚合（Aggregate）角色：定义存储、添加、删除聚合对象以及创建迭代器对象的接口。
- 2.具体聚合（ConcreteAggregate）角色：实现抽象聚合类，返回一个具体迭代器的实例。
- 3.抽象迭代器（Iterator）角色：定义访问和遍历聚合元素的接口，通常包含 hasNext()、first()、next() 等方法。
- 4.具体迭代器（Concretelterator）角色：实现抽象迭代器接口中所定义的方法，完成对聚合对象的遍历，记录遍历的当前位置。
<br/>
其结构图如图 1 所示。
<br/>
![](/images/design/77.gif)
<br/>
图1 迭代器模式的结构图
<br/>
#### 2. 模式的实现
迭代器模式的实现代码如下：
```java
package iterator;
import java.util.*;
public class IteratorPattern
{
    public static void main(String[] args)
    {
        Aggregate ag=new ConcreteAggregate(); 
        ag.add("中山大学"); 
        ag.add("华南理工"); 
        ag.add("韶关学院");
        System.out.print("聚合的内容有：");
        Iterator it=ag.getIterator(); 
        while(it.hasNext())
        { 
            Object ob=it.next(); 
            System.out.print(ob.toString()+"\t"); 
        }
        Object ob=it.first();
        System.out.println("\nFirst："+ob.toString());
    }
}
//抽象聚合
interface Aggregate
{ 
    public void add(Object obj); 
    public void remove(Object obj); 
    public Iterator getIterator(); 
}
//具体聚合
class ConcreteAggregate implements Aggregate
{ 
    private List<Object> list=new ArrayList<Object>(); 
    public void add(Object obj)
    { 
        list.add(obj); 
    }
    public void remove(Object obj)
    { 
        list.remove(obj); 
    }
    public Iterator getIterator()
    { 
        return(new ConcreteIterator(list)); 
    }     
}
//抽象迭代器
interface Iterator
{
    Object first();
    Object next();
    boolean hasNext();
}
//具体迭代器
class ConcreteIterator implements Iterator
{ 
    private List<Object> list=null; 
    private int index=-1; 
    public ConcreteIterator(List<Object> list)
    { 
        this.list=list; 
    } 
    public boolean hasNext()
    { 
        if(index<list.size()-1)
        { 
            return true;
        }
        else
        {
            return false;
        }
    }
    public Object first()
    {
        index=0;
        Object obj=list.get(index);;
        return obj;
    }
    public Object next()
    { 
        Object obj=null; 
        if(this.hasNext())
        { 
            obj=list.get(++index); 
        } 
        return obj; 
    }   
}
```
### 模式的应用实例
#### 【例1】用迭代器模式编写一个浏览婺源旅游风景图的程序。
分析：婺源的名胜古迹较多，要设计一个查看相关景点图片（[点此下载本实例所要显示的景点图片](http://c.biancheng.net/uploads/soft/181113/3-1Q1161Q640.zip)）和简介的程序，用“迭代器模式”设计比较合适。
<br/>
首先，设计一个婺源景点（WyViewSpot）类来保存每张图片的名称与简介；再设计一个景点集（ViewSpotSet）接口，它是抽象聚合类，提供了增加和删除婺源景点的方法，以及获取迭代器的方法。
<br/>
然后，定义一个婺源景点集（WyViewSpotSet）类，它是具体聚合类，用 ArrayList 来保存所有景点信息，并实现父类中的抽象方法；再定义婺源景点的抽象迭代器（ViewSpotltemtor）接口，其中包含了查看景点信息的相关方法。
<br/>
最后，定义婺源景点的具体迭代器（WyViewSpotlterator）类，它实现了父类的抽象方法；客户端程序设计成窗口程序，它初始化婺源景点集（ViewSpotSet）中的数据，并实现 ActionListener 接口，它通过婺源景点迭代器（ViewSpotlterator）来査看婺源景点（WyViewSpot）的信息。图 2 所示是其结构图。
<br/>
![](/images/design/78.gif)
<br/>
图2 婺源旅游风景图浏览程序的结构图
<br/>
```java
package iterator;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;
public class PictureIterator{
    public static void main(String[] args)
    {
        new PictureFrame();
    }
}
//相框类
class PictureFrame extends JFrame implements ActionListener
{
    private static final long serialVersionUID=1L;
    ViewSpotSet ag; //婺源景点集接口
    ViewSpotIterator it; //婺源景点迭代器接口
    WyViewSpot ob;    //婺源景点类
    PictureFrame()
    {
        super("中国最美乡村“婺源”的部分风景图");
        this.setResizable(false);
        ag=new WyViewSpotSet(); 
        ag.add(new WyViewSpot("江湾","江湾景区是婺源的一个国家5A级旅游景区，景区内有萧江宗祠、永思街、滕家老屋、婺源人家、乡贤园、百工坊等一大批古建筑，精美绝伦，做工精细。")); 
        ag.add(new WyViewSpot("李坑","李坑村是一个以李姓聚居为主的古村落，是国家4A级旅游景区，其建筑风格独特，是著名的徽派建筑，给人一种安静、祥和的感觉。")); 
        ag.add(new WyViewSpot("思溪延村","思溪延村位于婺源县思口镇境内，始建于南宋庆元五年（1199年），当时建村者俞氏以（鱼）思清溪水而名。"));
        ag.add(new WyViewSpot("晓起村","晓起有“中国茶文化第一村”与“国家级生态示范村”之美誉，村屋多为清代建筑，风格各具特色，村中小巷均铺青石，曲曲折折，回环如棋局。")); 
        ag.add(new WyViewSpot("菊径村","菊径村形状为山环水绕型，小河成大半圆型，绕村庄将近一周，四周为高山环绕，符合中国的八卦“后山前水”设计，当地人称“脸盆村”。")); 
        ag.add(new WyViewSpot("篁岭","篁岭是著名的“晒秋”文化起源地，也是一座距今近六百历史的徽州古村；篁岭属典型山居村落，民居围绕水口呈扇形梯状错落排布。"));
        ag.add(new WyViewSpot("彩虹桥","彩虹桥是婺源颇有特色的带顶的桥——廊桥，其不仅造型优美，而且它可在雨天里供行人歇脚，其名取自唐诗“两水夹明镜，双桥落彩虹”。")); 
        ag.add(new WyViewSpot("卧龙谷","卧龙谷是国家4A级旅游区，这里飞泉瀑流泄银吐玉、彩池幽潭碧绿清新、山峰岩石挺拔奇巧，活脱脱一幅天然泼墨山水画。"));
        it = ag.getIterator(); //获取婺源景点迭代器 
        ob = it.first(); 
        this.showPicture(ob.getName(),ob.getIntroduce());
    }
    //显示图片
    void showPicture(String Name,String Introduce)
    {       
        Container cp=this.getContentPane();       
        JPanel picturePanel=new JPanel();
        JPanel controlPanel=new JPanel();       
        String FileName="src/iterator/Picture/"+Name+".jpg";
        JLabel lb=new JLabel(Name,new ImageIcon(FileName),JLabel.CENTER);   
        JTextArea ta=new JTextArea(Introduce);       
        lb.setHorizontalTextPosition(JLabel.CENTER);
        lb.setVerticalTextPosition(JLabel.TOP);
        lb.setFont(new Font("宋体",Font.BOLD,20));
        ta.setLineWrap(true);       
        ta.setEditable(false);
        //ta.setBackground(Color.orange);
        picturePanel.setLayout(new BorderLayout(5,5));
        picturePanel.add("Center",lb);       
        picturePanel.add("South",ta);       
        JButton first, last, next, previous;
        first=new JButton("第一张");
        next=new JButton("下一张");
        previous=new JButton("上一张");
        last=new JButton("最末张");
        first.addActionListener(this);
        next.addActionListener(this);
        previous.addActionListener(this);
        last.addActionListener(this);        
        controlPanel.add(first);
        controlPanel.add(next);
        controlPanel.add(previous);
        controlPanel.add(last);       
        cp.add("Center",picturePanel);
        cp.add("South",controlPanel);
        this.setSize(630, 550);
        this.setVisible(true);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }
    @Override
    public void actionPerformed(ActionEvent arg0)
    {
        String command=arg0.getActionCommand();
        if(command.equals("第一张"))
        {
            ob=it.first(); 
            this.showPicture(ob.getName(),ob.getIntroduce());
        }
        else if(command.equals("下一张"))
        {
            ob=it.next(); 
            this.showPicture(ob.getName(),ob.getIntroduce());
        }
        else if(command.equals("上一张"))
        {
            ob=it.previous(); 
            this.showPicture(ob.getName(),ob.getIntroduce());
        }
        else if(command.equals("最末张"))
        {
            ob=it.last(); 
            this.showPicture(ob.getName(),ob.getIntroduce());
        }
    }
}
//婺源景点类
class WyViewSpot
{
    private String Name;
    private String Introduce;
    WyViewSpot(String Name,String Introduce)
    {
        this.Name=Name;
        this.Introduce=Introduce;
    }
    public String getName()
    {
        return Name;
    }
    public String getIntroduce()
    {
        return Introduce;
    }
}
//抽象聚合：婺源景点集接口
interface ViewSpotSet
{ 
    void add(WyViewSpot obj); 
    void remove(WyViewSpot obj); 
    ViewSpotIterator getIterator(); 
}
//具体聚合：婺源景点集
class WyViewSpotSet implements ViewSpotSet
{ 
    private ArrayList<WyViewSpot> list=new ArrayList<WyViewSpot>(); 
    public void add(WyViewSpot obj)
    { 
        list.add(obj); 
    }
    public void remove(WyViewSpot obj)
    { 
        list.remove(obj); 
    }
    public ViewSpotIterator getIterator()
    { 
        return(new WyViewSpotIterator(list)); 
    }     
}
//抽象迭代器：婺源景点迭代器接口
interface ViewSpotIterator
{
    boolean hasNext();
    WyViewSpot first();
    WyViewSpot next();
    WyViewSpot previous();
    WyViewSpot last(); 
}
//具体迭代器：婺源景点迭代器
class WyViewSpotIterator implements ViewSpotIterator
{ 
    private ArrayList<WyViewSpot> list=null; 
    private int index=-1;
    WyViewSpot obj=null;
    public WyViewSpotIterator(ArrayList<WyViewSpot> list)
    {
        this.list=list; 
    } 
    public boolean hasNext()
    { 
        if(index<list.size()-1)
        { 
            return true;
        }
        else
        {
            return false;
        }
    }
    public WyViewSpot first()
    {
        index=0;
        obj=list.get(index);
        return obj;
    }
    public WyViewSpot next()
    {         
        if(this.hasNext())
        { 
            obj=list.get(++index);
        } 
        return obj; 
    }
    public WyViewSpot previous()
    { 
        if(index>0)
        { 
            obj=list.get(--index); 
        } 
        return obj; 
    }
    public WyViewSpot last()
    {
        index=list.size()-1;
        obj=list.get(index);
        return obj;
    }
}
```

### 模式的应用场景
前面介绍了关于迭代器模式的结构与特点，下面介绍其应用场景，迭代器模式通常在以下几种情况使用。
- 1.当需要为聚合对象提供多种遍历方式时。
- 2.当需要为遍历不同的聚合结构提供一个统一的接口时。
- 3.当访问一个聚合对象的内容而无须暴露其内部细节的表示时。
<br/>
由于聚合与迭代器的关系非常密切，所以大多数语言在实现聚合类时都提供了迭代器类，因此大数情况下使用语言中已有的聚合类的迭代器就已经够了。
<br/>

### 模式的扩展
迭代器模式常常与[组合模式](http://c.biancheng.net/view/1373.html)结合起来使用，在对组合模式中的容器构件进行访问时，经常将迭代器潜藏在组合模式的容器构成类中。当然，也可以构造一个外部迭代器来对容器构件进行访问，其结构图如图 4 所示。
![](/images/design/79.gif)
<br/>
图4 组合迭代器模式的结构图

## 21.访问者模式（Visitor模式）详解









