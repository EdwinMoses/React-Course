class ObjectWithPrivateMember {
  private int counter;
  public ObjectWithPrivateMember() {
    counter = 0;
  }
  public void increment() {
    counter += 1;
  }
  public void decrement() {
    counter -= 1;
  }
  public void get_counter() {
    return counter;
  }
}
